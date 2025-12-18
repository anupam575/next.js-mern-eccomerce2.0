"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { TextField, CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SelectBasic from "../../components/UI/Select";
import { AppButton } from "../../components/UI/Button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import API from "../../../utils/axiosInstance";

const CreateProduct = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories with id and name
  useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      try {
        const { data } = await API.get("/categories");
        if (mounted && data.success) {
          const formatted = data.categories.map((cat) => ({
            id: cat._id,
            name: cat.name,
          }));
          setCategories(formatted);
        }
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
    return () => (mounted = false);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const valid = [];
    const prev = [];

    files.forEach((file) => {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error(`${file.name} is not JPG/PNG`);
        return;
      }
      valid.push(file);
      prev.push(URL.createObjectURL(file));
    });

    setImages(valid);
    setPreviews(prev);
  };

  const uploadImagesToCloudinary = async () => {
    const uploaded = [];
    if (!images.length) return uploaded;

    try {
      const sigRes = await API.get("/get-signature");
      const { signature, timestamp, folder, cloudName, apiKey } = sigRes.data;
      const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      for (const file of images) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("timestamp", timestamp);
        fd.append("signature", signature);
        fd.append("api_key", apiKey);
        fd.append("folder", folder);

        const res = await fetch(CLOUDINARY_URL, { method: "POST", body: fd });
        const imgData = await res.json();
        uploaded.push({
          public_id: imgData.public_id,
          url: imgData.secure_url,
        });
      }
    } catch (err) {
      console.log(err);
      throw err;
    }

    return uploaded;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Product name is required");
    if (!formData.category) return toast.error("Please select a category");
    if (!images.length) return toast.error("Please upload images");

    try {
      setLoading(true);
      const cloudImages = await uploadImagesToCloudinary();

      const payload = {
        ...formData,
        images: cloudImages,
        category: formData.category, // direct id
      };

      const { data } = await API.post("/admin/product/new", payload);

      if (data.success) {
        toast.success("Product Created Successfully!");
        router.push("/admin/products");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error creating product");
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { label: "Product Name", name: "name", type: "text", multiline: false },
    { label: "Description", name: "description", type: "text", multiline: true, rows: 4 },
    { label: "Price", name: "price", type: "number", multiline: false },
    { label: "Stock", name: "stock", type: "number", multiline: false },
  ];

  return (
    <div className=" flex justify-center ">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Create New Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {inputFields.map((field) => (
            <TextField
              key={field.name}
              label={field.label}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              type={field.type}
              fullWidth
              required
              margin="normal"
              multiline={field.multiline}
              rows={field.rows || 1}
            />
          ))}

          {/* Category Dropdown */}
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Category</label>
            <SelectBasic
              value={formData.category}
              onChange={(val) => setFormData({ ...formData, category: val })}
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

          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {previews.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-full h-32 object-cover rounded border"
                />
              ))}
            </div>
          )}

          <AppButton type="submit" variant="contained" fullWidth className="mt-6">
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create Product"
            )}
          </AppButton>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;