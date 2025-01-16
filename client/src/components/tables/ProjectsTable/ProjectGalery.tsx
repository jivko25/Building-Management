import React, { useEffect, useState } from "react";
import { Image } from "primereact/image";
import apiClient from "@/api/axiosConfig";
import { useParams } from "react-router-dom";

export type ImageType = {
  id: number;
  projectId: number;
  imageUrl: string;
};

interface ProjectGalleryProps {}

const ProjectGallery: React.FC<ProjectGalleryProps> = () => {
  const [images, setImages] = useState<ImageType[]>([]);
  const { id } = useParams();

  const handleDeleteImage = (id: number) => {
    apiClient.delete(`/images/${id}`).then(() => {
      setImages(images.filter(image => image.id !== id));
    });
    console.log(images)
  }

  useEffect(() => {
    const fetchImages = async () => {
      apiClient.get(`/images/${id}`).then(response => {
        setImages(response.data.images);
      });
    };

    fetchImages();
  }, [id]);
  return (
    <div className="card flex justify-center flex-wrap gap-5">
      {images.map((item, index) => (
        <div key={index} className="relative flex items-center justify-center">
          <Image key={index} src={item.imageUrl} alt={`Image ${index + 1}`} width="250" preview downloadable />
          <i 
          className="pi pi-trash absolute top-2 right-2 text-white rounded-full p-2 cursor-pointer" 
          style={{ color: 'red' }} 
          onClick={() => handleDeleteImage(item.id)}></i>
        </div>
      ))}
    </div>
  );
};

export default ProjectGallery;
