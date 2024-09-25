import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Page } from "@shopify/polaris";
import { useGetCoordinatesMutation } from "../../stores/CoordinateStore";

function IconTable(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M4 21h15.893c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zm0-2v-5h4v5H4zM14 7v5h-4V7h4zM8 7v5H4V7h4zm2 12v-5h4v5h-4zm6 0v-5h3.894v5H16zm3.893-7H16V7h3.893v5z" />
    </svg>
  );
}

export default function Tracker() {
  const userData = useSelector((state) => state.user);
  const [coordinates, setCoordinates] = useState([]);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [filteredCoordinates, setFilteredCoordinates] = useState([]);

  useEffect(() => {
    handleFetchCoordinates();
  }, []);

  const [getCoordinates, { isLoading }] = useGetCoordinatesMutation();

  const handleFetchCoordinates = async () => {
    console.log({"token": userData?.token?.data?.jwt})
    const response = await getCoordinates({ token: userData?.token?.data?.jwt });
    console.log({response})
    if (!response?.data?.coordinates?.data || !Array.isArray(response?.data?.coordinates?.data)) {
      return;
    }
  }

  return (
    <Page
      title="TRACKER"
      fullWidth
    >
      <div className="grid grid-cols-2 grid-rows-2 gap-5">
        <div className="border rounded-md border-gray-300">
          <Page
            title="Coordenadas"
            fullWidth
            primaryAction={<Button icon={<IconTable />} variant="primary">Excel</Button>}
          >

          </Page>
        </div>
        <div >2</div>
        <div >3</div>
        <div >4</div>
      </div>
    </Page>
  );
}