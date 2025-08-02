"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { fetchCategories} from '../utils/api';
import { X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductForm({ product, onSubmit, onCancel }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(product || {
    sku: '',
    name: '',
    description: '',
    grade: '',
    dimensions: {
      type: 'plate',
      thickness_mm: '',
      width_mm: '',
      length_mm: ''
    },
    weight_per_unit: 0,
    unit_of_measure: 'kg',
    minimum_order_qty: 100,
    price_per_unit: 0,
    hsn_code: '',
    heat_number: '',
    chemical_composition: {},
    mechanical_properties: {},
    is_active: true,
    category_id: '', // Change selected_categories to category_id
  });

  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');

  // Fetch categories when component mounts
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        toast.error('Failed to load categories');
      }
    };
    loadCategories();
  }, []);

  // Update the useEffect to initialize form data when product prop changes
  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        category_id: product.category?.category_id || ''
      });
      setImages(product.images || []);
      setDocuments(product.documents || []);
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleDimensionsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [name]: value
      }
    }));
  };

  // Replace handleCategoryChange with this simpler version
  const handleCategoryChange = (e) => {
    const categoryId = parseInt(e.target.value);
    setFormData(prev => ({
      ...prev,
      category_id: categoryId
    }));
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    if (!imageUrl) return;

    setImages(prev => [...prev, {
      image_path: imageUrl,
      alt_text: '',
      sort_order: prev.length
    }]);
    setImageUrl('');
  };

  const handleAddDocument = (e) => {
    e.preventDefault();
    if (!documentUrl) return;

    setDocuments(prev => [...prev, {
      file_path: documentUrl,
      document_type: 'mtr',
      reference_number: ''
    }]);
    setDocumentUrl('');
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (currentImageIndex >= images.length - 1) {
      setCurrentImageIndex(Math.max(0, images.length - 2));
    }
  };

  const removeDocument = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        images,
        documents,
        categories: formData.selected_categories
      };
      await onSubmit(submitData);
      toast.success('Product saved successfully');
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl border border-gray-100">
      {/* Title Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <p className="text-gray-500 mt-1">
            {product ? 'Update product details' : 'Add a new product to your inventory'}
          </p>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">SKU</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category_id"
              value={formData.category_id || ''}
              onChange={handleCategoryChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 bg-white"
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Specifications */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Grade</label>
            <input
              type="text"
              name="grade"
              value={formData.grade}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Heat Number</label>
            <input
              type="text"
              name="heat_number"
              value={formData.heat_number}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Product Type</label>
            <select
              name="type"
              value={formData.dimensions.type}
              onChange={handleDimensionsChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="plate">Plate</option>
              <option value="pipe">Pipe</option>
              <option value="bar">Bar</option>
              <option value="sheet">Sheet</option>
              <option value="coil">Coil</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Thickness (mm)</label>
              <input
                type="number"
                name="thickness_mm"
                value={formData.dimensions.thickness_mm}
                onChange={handleDimensionsChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Width (mm)</label>
              <input
                type="number"
                name="width_mm"
                value={formData.dimensions.width_mm}
                onChange={handleDimensionsChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Length (mm)</label>
              <input
                type="number"
                name="length_mm"
                value={formData.dimensions.length_mm}
                onChange={handleDimensionsChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Pricing & Stock</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">HSN Code</label>
            <input
              type="text"
              name="hsn_code"
              value={formData.hsn_code}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Unit of Measure</label>
            <select
              name="unit_of_measure"
              value={formData.unit_of_measure}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="kg">Kilogram (kg)</option>
              <option value="meter">Meter</option>
              <option value="piece">Piece</option>
              <option value="ton">Ton</option>
              <option value="coil">Coil</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Weight per Unit (kg)</label>
            <input
              type="number"
              name="weight_per_unit"
              value={formData.weight_per_unit}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              step="0.001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Order Quantity</label>
            <input
              type="number"
              name="minimum_order_qty"
              value={formData.minimum_order_qty}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              step="0.001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price per Unit (₹)</label>
            <input
              type="number"
              name="price_per_unit"
              value={formData.price_per_unit}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              step="0.01"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Product is active and available for sale
            </label>
          </div>
        </div>
      </div>

      {/* Media Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
          
          {/* Image Preview */}
          <div className="relative h-64 bg-gray-50 rounded-lg border border-gray-200">
            {images.length > 0 ? (
              <>
                <img
                  src={images[currentImageIndex].image_path}
                  alt="Product preview"
                  className="h-full w-full object-contain rounded-lg"
                />
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setCurrentImageIndex(i => i > 0 ? i - 1 : images.length - 1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentImageIndex(i => i < images.length - 1 ? i + 1 : 0)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full bg-black/50 text-white text-sm">
                      {currentImageIndex + 1}/{images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-500">
                No images added
              </div>
            )}
          </div>

          {/* Image URL Input - Convert form to div */}
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium"
            >
              Add Image
            </button>
          </div>

          {/* Image Thumbnails */}
          <div className="flex flex-wrap gap-2">
            {images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img.image_path}
                  alt={`Preview ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Product Documents</h3>
          
          {/* Document List */}
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <a 
                    href={doc.file_path}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    {doc.file_path.split('/').pop()}
                  </a>
                  <select
                    value={doc.document_type}
                    onChange={(e) => {
                      const newDocs = [...documents];
                      newDocs[index].document_type = e.target.value;
                      setDocuments(newDocs);
                    }}
                    className="mt-1 block w-full text-sm rounded-md border-gray-300"
                  >
                    <option value="mtr">Material Test Report</option>
                    <option value="test_certificate">Test Certificate</option>
                    <option value="safety_data_sheet">Safety Data Sheet</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeDocument(index)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {/* Document URL Input - Convert form to div */}
            <div className="flex gap-2">
              <input
                type="url"
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
                placeholder="Enter document URL"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={handleAddDocument}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium"
              >
                Add Document
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {product ? 'Update Product' : 'Save Product'}
        </button>
      </div>
    </form>
  );
}