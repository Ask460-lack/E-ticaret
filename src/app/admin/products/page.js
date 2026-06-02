"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Package, Plus, UploadCloud, Pencil, Trash2, X } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    images: "",
    category: "",
    stock: "",
  });

  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    const data = new FormData();

    Array.from(files).forEach((file) => {
      data.append("files", file);
    });

    try {
      const res = await axios.post("/api/upload", data);

      const uploadedUrls = res.data.images.join("\n");

      setForm((prev) => ({
        ...prev,
        images: prev.images ? `${prev.images}\n${uploadedUrls}` : uploadedUrls,
      }));

      alert("Görseller yüklendi");
    } catch {
      alert("Görsel yükleme başarısız");
    }
  };

  const fetchProducts = async () => {
    const res = await axios.get("/api/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setEditingId(null);

    setForm({
      title: "",
      description: "",
      price: "",
      images: "",
      category: "",
      stock: "",
    });
  };

  const validateForm = () => {
    if (
      !form.title ||
      !form.description ||
      !form.price ||
      !form.images ||
      !form.category ||
      form.stock === ""
    ) {
      alert("Lütfen tüm ürün bilgilerini doldurun");
      return false;
    }

    if (Number(form.price) <= 0) {
      alert("Fiyat 0'dan büyük olmalı");
      return false;
    }

    if (Number(form.stock) < 0) {
      alert("Stok negatif olamaz");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const imageArray = form.images
      .split("\n")
      .map((img) => img.trim())
      .filter(Boolean);

    const normalizedCategory = form.category.trim().toUpperCase();

    const productData = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: parseInt(String(form.price).replace(/\D/g, ""), 10),
      images: imageArray,
      category: normalizedCategory,
      stock: parseInt(String(form.stock).replace(/\D/g, ""), 10),
    };

    if (editingId) {
      await axios.patch(`/api/products/${editingId}`, productData);

      alert("Ürün güncellendi");
    } else {
      await axios.post("/api/products", productData);

      alert("Ürün eklendi");
    }

    resetForm();
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      title: product.title || "",
      description: product.description || "",
      price: product.price || "",
      images: product.images?.join("\n") || "",
      category: product.category || "",
      stock: product.stock || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Bu ürünü silmek istediğine emin misin?");

    if (!confirmDelete) return;

    await axios.delete(`/api/products/${id}`);

    alert("Ürün silindi");

    fetchProducts();
  };

  return (
    <main className="w-full">
      <section className="mb-12 flex flex-col items-center rounded-[32px] border border-orange-100 bg-white px-6 py-12 text-center shadow-sm sm:px-8 lg:px-12">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2">
          <Package size={18} className="text-orange-600" />

          <span className="text-sm font-bold text-orange-600">
            Ürün Yönetimi
          </span>
        </div>

        <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
          Ürün Yönetimi
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
          Yeni ürün ekleyin, mevcut ürünleri düzenleyin ve stok bilgilerini
          yönetin.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mb-16 rounded-[32px] border border-orange-100 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
      >
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-950">
            {editingId ? "Ürün Güncelle" : "Yeni Ürün Ekle"}
          </h2>

          <p className="mt-3 text-slate-600">
            Ürün bilgilerini eksiksiz doldurun.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <input
            value={form.title}
            placeholder="Ürün adı"
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            className="rounded-2xl border border-orange-100 bg-orange-50 p-4 font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:bg-white md:col-span-2"
          />

          <textarea
            value={form.description}
            placeholder="Açıklama"
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            className="min-h-32 rounded-2xl border border-orange-100 bg-orange-50 p-4 font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:bg-white md:col-span-2"
          />

          <input
            value={form.price}
            placeholder="Fiyat"
            type="number"
            min="0"
            step="1"
            onChange={(e) =>
              setForm({
                ...form,
                price: e.target.value,
              })
            }
            className="rounded-2xl border border-orange-100 bg-orange-50 p-4 font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:bg-white"
          />

          <input
            value={form.stock}
            placeholder="Stok"
            type="number"
            onChange={(e) =>
              setForm({
                ...form,
                stock: e.target.value,
              })
            }
            className="rounded-2xl border border-orange-100 bg-orange-50 p-4 font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:bg-white"
          />

          <input
            value={form.category}
            placeholder="Kategori"
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
            className="rounded-2xl border border-orange-100 bg-orange-50 p-4 font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:bg-white md:col-span-2"
          />

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();

              handleImageUpload(e.dataTransfer.files);
            }}
            className="rounded-[28px] border-2 border-dashed border-orange-200 bg-orange-50 p-8 text-center md:col-span-2"
          >
            <UploadCloud size={42} className="mx-auto mb-4 text-orange-600" />

            <p className="text-lg font-black text-slate-950">
              Görselleri buraya sürükleyin
            </p>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="mt-5 w-full cursor-pointer rounded-2xl border border-orange-100 bg-white p-3 text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:font-bold file:text-white"
            />
          </div>

          <textarea
            value={form.images}
            placeholder="Her satıra bir görsel URL"
            onChange={(e) =>
              setForm({
                ...form,
                images: e.target.value,
              })
            }
            className="min-h-36 rounded-2xl border border-orange-100 bg-orange-50 p-4 font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:bg-white md:col-span-2"
          />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 font-black text-white transition hover:bg-orange-600">
            <Plus size={20} />

            {editingId ? "Güncelle" : "Ürün Ekle"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-8 py-4 font-bold text-orange-700 transition hover:bg-orange-100"
            >
              <X size={20} />
              İptal
            </button>
          )}
        </div>
      </form>

      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-950">Mevcut Ürünler</h2>

        <p className="mt-3 text-slate-600">
          Sistemde kayıtlı ürünleri düzenleyebilir veya silebilirsiniz.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <div
            key={product._id}
            className="overflow-hidden rounded-[32px] border border-orange-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <img
              src={product.images?.[0]}
              alt={product.title}
              className="mb-5 h-56 w-full rounded-2xl bg-orange-50 object-contain p-4"
            />

            <h2 className="text-2xl font-black text-slate-950">
              {product.title}
            </h2>

            <p className="mt-3 line-clamp-3 leading-7 text-slate-600">
              {product.description}
            </p>

            <div className="mt-5 space-y-2 rounded-2xl border border-orange-100 bg-orange-50 p-4">
              <p className="text-xl font-black text-orange-600">
                ₺
                {Number(product.price).toLocaleString("tr-TR", {
                  maximumFractionDigits: 0,
                })}
              </p>

              <p className="text-sm text-slate-600">
                Kategori:{" "}
                <span className="font-bold text-slate-950">
                  {product.category}
                </span>
              </p>

              <p className="text-sm text-slate-600">
                Stok:{" "}
                <span className="font-bold text-slate-950">
                  {product.stock}
                </span>
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => handleEdit(product)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 font-bold text-white transition hover:bg-orange-600"
              >
                <Pencil size={18} />
                Düzenle
              </button>

              <button
                onClick={() => handleDelete(product._id)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 font-bold text-white transition hover:bg-red-600"
              >
                <Trash2 size={18} />
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
