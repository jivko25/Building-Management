import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ArtisansDetailsTable from "@/components/tables/ArtisansTable/ArtisansDetailsTable";
import Sidebar from "../components/Sidebar/Sidebar";
import apiClient from "@/api/axiosConfig";

const ArtisansDetailsPage = () => {
  const { id } = useParams<{ id: string }>(); // Взима id от URL-а
  const [data, setData] = useState([]);
  const [artisanName, setArtisanName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    apiClient
      .get(`/artisans/${id}/workitems`)
      .then((response: any) => {
        const mappedData = response.data.workItems.map((item: any) => ({
          ...item,
          created_at: new Date(item.created_at), // Преобразуване на created_at към Date обект
        }));
        setArtisanName(response.data.artisan_name);
        setData(mappedData);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error("Error fetching data:", err);
        setError("Неуспешно зареждане на данните");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Зареждане...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex md:gap-60 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col p-2 md:gap-8 items-center pt-10">
        <ArtisansDetailsTable data={data} artisanName={artisanName}/>
      </div>
    </div>
  );
};

export default ArtisansDetailsPage;
