import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseConfig';

function ImageGallery() {
  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddImage(e) {
    e.preventDefault();
    if (!newImageUrl.trim()) return;

    try {
      const { data, error } = await supabase
        .from('images')
        .insert([
          { url: newImageUrl, link: newImageUrl }
        ])
        .select();

      if (error) throw error;
      
      setImages([...images, ...data]);
      setNewImageUrl('');
    } catch (error) {
      console.error('Error adding image:', error.message);
    }
  }

  async function handleFileUpload(event) {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Add image to database
      const { data: imageData, error: dbError } = await supabase
        .from('images')
        .insert([
          { url: publicUrl, link: publicUrl }
        ])
        .select();

      if (dbError) throw dbError;
      
      setImages([...images, ...imageData]);
    } catch (error) {
      console.error('Error uploading image:', error.message);
      alert('Error uploading image!');
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteImage(id) {
    try {
      const { error } = await supabase
        .from('images')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setImages(images.filter(image => image.id !== id));
    } catch (error) {
      console.error('Error deleting image:', error.message);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', justifyContent: 'center' }}>

        <div>
            <br></br>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ display: 'none' }}
            id="fileInput"
          />
          <button
            onClick={() => document.getElementById('fileInput').click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
        padding: '20px'
      }}>
        {images.map((image) => (
          <div key={image.id} style={{ position: 'relative' }}>
            <a 
              href={image.link} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'block' }}
            >
              <img
                src={image.url}
                alt={`Gallery image`}
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  transition: 'transform 0.2s'
                }}
              />
            </a>
            <button
              onClick={() => handleDeleteImage(image.id)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(255, 0, 0, 0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageGallery;