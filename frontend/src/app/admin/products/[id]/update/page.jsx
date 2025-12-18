"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { TextField, CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SelectBasic from "../../../../components/UI/Select";
import { AppButton } from "../../../../components/UI/Button";
import { toast } from "react-toastify";
import API from "../../../../../utils/axiosInstance";

const UpdateProduct = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",  // ✅ always string
    stock: "",
  });

  const [categories, setCategories] = useState([]); // {label,value}
  const [oldImages, setOldImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const inputFields = [
    { name: "name", label: "Product Name", type: "text", multiline: false },
    { name: "description", label: "Description", type: "text", multiline: true, rows: 4 },
    { name: "price", label: "Price", type: "number", multiline: false },
    { name: "stock", label: "Stock", type: "number", multiline: false },
  ];

  // Fetch product details
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/admin/product/${id}`);
        const prod = data.product;

        setProductData({
          name: prod.name || "",
          description: prod.description || "",
          price: prod.price || "",
          category: prod.category?._id || "", // ✅ always string
          stock: prod.stock || "",
        });

        setOldImages(prod.images || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "❌ Error loading product");
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get("/categories");
        if (data.success) {
          setCategories(
            data.categories.map((cat) => ({
              label: cat.name,
              value: cat._id,
            }))
          );
        }
      } catch {
        toast.error("❌ Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = [];
    const previewsArr = [];

    files.forEach((file) => {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error(`${file.name} is not JPG/PNG`);
      } else {
        validFiles.push(file);
        previewsArr.push(URL.createObjectURL(file));
      }
    });

    setNewImages(validFiles);
    setPreviews(previewsArr);
  };

  const uploadImagesToCloudinary = async (images) => {
    const uploaded = [];
    if (!images.length) return uploaded;

    try {
      const sigRes = await API.get("/get-signature");
      const { signature, timestamp, folder, cloudName, apiKey } = sigRes.data;
      const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      for (const image of images) {
        const fd = new FormData();
        fd.append("file", image);
        fd.append("api_key", apiKey);
        fd.append("timestamp", timestamp);
        fd.append("signature", signature);
        fd.append("folder", folder);

        const res = await fetch(CLOUDINARY_URL, { method: "POST", body: fd });
        const data = await res.json();
        uploaded.push({ public_id: data.public_id, url: data.secure_url });
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
    return uploaded;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedImages = newImages.length
        ? await uploadImagesToCloudinary(newImages)
        : [];

      const payload = {
        ...productData,
        images: uploadedImages.length ? uploadedImages : oldImages,
      };

      await API.put(`/admin/product/${id}`, payload);

      toast.success("✅ Product updated successfully!");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Error updating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {inputFields.map((field) => (
            <TextField
              key={field.name}
              label={field.label}
              name={field.name}
              value={productData[field.name]}
              onChange={handleChange}
              type={field.type}
              fullWidth
              required
              margin="normal"
              multiline={field.multiline}
              rows={field.rows || 1}
            />
          ))}

          {/* Category */}
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Category</label>
            <SelectBasic
              value={productData.category}
              onChange={(val) => setProductData({ ...productData, category: val })}
              options={categories}
            />
          </div>

          {/* Upload Images */}
          <AppButton
            variant="contained"
            startIcon={<CloudUploadIcon />}
            className="mt-4"
            onClick={() => document.getElementById("fileInput").click()}
          >
            Upload Images
            <input
              type="file"
              id="fileInput"
              hidden
              multiple
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
            />
          </AppButton>

          {/* Previews */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {(previews.length ? previews : oldImages.map((img) => img.url)).map(
              (src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Preview ${idx}`}
                  className="w-full h-32 object-cover rounded border"
                />
              )
            )}
          </div>

          <AppButton type="submit" variant="contained" fullWidth className="mt-6">
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update Product"
            )}
          </AppButton>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
