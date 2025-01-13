import React, { useEffect, useState } from 'react';
import { Image } from 'primereact/image';
import apiClient from '@/api/axiosConfig';
import { useParams } from 'react-router-dom';

export type ImageType = {
    id: number;
    projectId: number;
    imageUrl: string;
}

interface ProjectGalleryProps {
}

const ProjectGallery: React.FC<ProjectGalleryProps> = () => {
    const [images, setImages] = useState<ImageType[]>([]);
    const { id } = useParams();

    useEffect(() => {
        const fetchImages = async () => {
          apiClient.get(`/images/${id}`).then(response => {
            setImages(response.data.images);
          });
        };
    
        fetchImages();
      }, [id]);
  return (
    <div className="card flex justify-content-center flex-wrap gap-4">
      {images.map((item, index) => (
        <Image key={index} src={item.imageUrl} alt={`Image ${index + 1}`} width="250" preview downloadable/>
      ))}
    </div>
  );
};

export default ProjectGallery;