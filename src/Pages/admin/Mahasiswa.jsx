import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import { login } from "../../redux/AuthSlice";

const Mahasiswa = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({ nim: '', nama: '', alamat: '', umur: '', progdi_id: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [prodiList, setProdiList] = useState([]);
  const [selectedProdi, setSelectedProdi] = useState(1);  // Default selected prodi
  
  const token = useSelector((state) => state.auth.token);

    // Pemetaan antara progdi_id dan nama prodi
  const prodiNames = {
    1: "Teknik Informatika",
    2: "Sistem Informasi",
    3: "Manajemen",
    4: "Ekonomi",
    5: "Psikologi",
    6: "Sastra Inggris",
    7: "Kedokteran",
    8: "Desain Grafis",
    9: "Desain Komunikasi Visual",
    10: "Ilmu Hukum"
  };

  const dispatch = useDispatch();
  
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    dispatch(login({ user: JSON.parse(storedUser), token: storedToken }));

    const fetchData = async () => {
      try {
        const mahasiswaResponse = await axios.get('http://demo-api.syaifur.io/api/mahasiswa', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(mahasiswaResponse.data.data);
        setFilteredData(mahasiswaResponse.data.data); // Initialize filtered data
        const uniqueProdiList = mahasiswaResponse.data.data
          .map(item => item.progdi_id) // Ambil hanya progdi_id
          .filter((value, index, self) => self.indexOf(value) === index)
          .sort((a, b) => a - b); // Urutkan dari yang terkecil

        setProdiList(uniqueProdiList);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleProdiFilter = (prodi_id) => {
    setSelectedProdi(prodi_id);
    const filtered = data.filter((item) => item.progdi_id === prodi_id);
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page after filter
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddOrUpdateMahasiswa = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const url = isEditMode
        ? `http://demo-api.syaifur.io/api/mahasiswa/${selectedId}`
        : 'http://demo-api.syaifur.io/api/mahasiswa';
      const method = isEditMode ? 'put' : 'post';

      const response = await axios({
        method,
        url,
        data: form,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (isEditMode) {
        setData((prev) =>
          prev.map((item) => (item.id === selectedId ? response.data.data : item))
        );
      } else {
        setData((prev) => [...prev, response.data.data]);
      }

      setForm({ progdi_id: 1, nim: '', nama: '', alamat: '', umur: '' });
      setShowModal(false);

      Swal.fire({
        title: isEditMode ? "Berhasil Mengubah Mahasiswa" : "Berhasil Menambah Mahasiswa",
        text: isEditMode ? "Anda telah berhasil mengubah data mahasiswa" : "Anda telah berhasil menambahkan data mahasiswa",
        icon: "success"
      });

    } catch (err) {
      setError(err.message);
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMahasiswa = async (id) => {
    const result = await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Anda akan menghapus data mahasiswa",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, saya yakin!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://demo-api.syaifur.io/api/mahasiswa/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData((prev) => prev.filter((item) => item.id !== id));

        await Swal.fire({
          title: "Deleted!",
          text: "Mahasiswa berhasil dihapus.",
          icon: "success",
        });
      } catch (err) {
        setError(err.message);

        await Swal.fire({
          title: "Error!",
          text: "Terjadi kesalahan saat menghapus data.",
          icon: "error",
        });
      }
    }
  };

  const handleEdit = (mahasiswa) => {
    setIsEditMode(true);
    setSelectedId(mahasiswa.id);
    setForm({
      progdi_id: mahasiswa.progdi_id,
      nim: mahasiswa.nim,
      nama: mahasiswa.nama,
      alamat: mahasiswa.alamat,
      umur: mahasiswa.umur,
    });
    setShowModal(true);
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error: {error}</p>;

  const Row = ({ index, style }) => {
    const item = getPaginatedData()[index];
    return (
      <tr key={item.id} style={style} className="hover:bg-gray-50">
        <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
        <td className="border border-gray-300 px-4 py-2">{item.nim}</td>
        <td className="border border-gray-300 px-4 py-2">{item.nama}</td>
        <td className="border border-gray-300 px-4 py-2 text-center">
          <button
            className="bg-green-400 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
            onClick={() => handleEdit(item)}
          >
            Ubah
          </button>
          <button
            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-600"
            onClick={() => handleDeleteMahasiswa(item.id)}
          >
            Hapus
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">MAHASISWA</h1>

      <div className="mb-4">
        <h3 className="text-lg">Filter  Program Studi</h3>
        <div className="space-x-2">
        {prodiList.map((progdi_id) => (
          <button
            key={progdi_id}
            onClick={() => handleProdiFilter(progdi_id)}
            className={`px-4 py-2 col mb-2 rounded ${progdi_id === selectedProdi ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
          >
            {prodiNames[progdi_id]} {/* Menampilkan nama prodi berdasarkan progdi_id */}
          </button>
        ))}
        </div>
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
        onClick={() => {
          setIsEditMode(false);
          setSelectedId(null);
          setForm({ progdi_id: 1, nim: '', nama: '', alamat: '', umur: '' });
          setShowModal(true);
        }}
      >
        Tambah Mahasiswa
      </button>

      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">NO</th>
            <th className="border border-gray-300 px-4 py-2">NIM</th>
            <th className="border border-gray-300 px-4 py-2">Nama</th>
            <th className="border border-gray-300 px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {getPaginatedData().map((item, index) => (
            <Row key={item.id} index={index} style={{}} />
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {isEditMode ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                &times;
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">NIM</label>
              <input
                type="text"
                name="nim"
                value={form.nim}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Nama</label>
              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Alamat</label>
              <input
                type="text"
                name="alamat"
                value={form.alamat}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Umur</label>
              <input
                type="text"
                name="umur"
                value={form.umur}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
           
            <button
              onClick={handleAddOrUpdateMahasiswa}
              disabled={isSubmitting}
              className={`w-full py-2 rounded text-white ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500'} hover:bg-blue-600`}
            >
              {isSubmitting ? 'Menunggu...' : isEditMode ? 'Update' : 'Tambah'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mahasiswa;