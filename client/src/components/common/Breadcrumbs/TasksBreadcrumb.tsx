import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";
import apiClient from "@/api/axiosConfig";
import CreateTask from "@/components/Forms/Tasks/TaskFormCreate/CreateTask";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const TasksBreadcrumbs = () => {
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Отваря файловата система
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await apiClient.post(`/images/upload/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      console.log("Image uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 md:left-60 right-0 z-40 pt-5 mt-14 bg-transparent backdrop-blur-sm">
      <div className="my-4 mx-8 space-y-4 px-4">
        <Breadcrumb
          items={[
            {
              label: t("Projects"),
              href: "/projects"
            },
            {
              label: t("Tasks"),
              href: `/projects/${id}/tasks`
            }
          ]}
        />
      </div>
      <div className="flex md:flex-row flex-col items-center border rounded-lg mx-8 p-4 backdrop-blur-sm project-cards-wrapper gap-3">
        <CreateTask />
        <Button variant="outline" onClick={handleButtonClick} className="md:w-auto w-full">
          <i className="pi pi-upload mr-3" style={{ color: "white", fontSize: "12px" }}></i>
          {t("Upload Image")}
        </Button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      </div>
    </div>
  );
};

export default TasksBreadcrumbs;
