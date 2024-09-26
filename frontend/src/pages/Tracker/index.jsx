import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Badge, Button, DataTable, LegacyCard, Page, TextField, FooterHelp, Link } from "@shopify/polaris";
import { useGetCoordinatesMutation, useGetCoordinatesPaginatedMutation } from "../../stores/CoordinateStore";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BubbleChart from "./components/BubbleChart";

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

const notify = (message) => toast(message);

export default function Tracker() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const [coordinates, setCoordinates] = useState([]);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalEtries, setTotalEntries] = useState(0);
  const [filteredCoordinates, setFilteredCoordinates] = useState([]);
  const [rows, setRows] = useState([]);
  const [charts, setCharts] = useState({
    byStateDecrease: [],
    byCityIncrease: [],
  });

  useEffect(() => {
    handleFetchCoordinates();
  }, []);

  useEffect(() => {
    handleFetchCoordinatesPaginated();
  }, [limit, page, query]);

  const [getCoordinates, { isLoading }] = useGetCoordinatesMutation();
  const [getCoordinatesPaginated, { isLoading: isLoadingPaginated }] = useGetCoordinatesPaginatedMutation();

  const handleFetchCoordinates = async () => {
    const response = await getCoordinates({ token: userData?.token?.data?.jwt });
    if (!response?.data && !response?.data?.coordinates && !Array.isArray(!response?.data?.coordinates) && isLoading) {
      notify("No se pudieron obtener las coordenadas");
      return;
    }
    setCoordinates(response?.data?.coordinates);
    const stateDecrease = response?.data?.coordinates?.map((co, index) => ({ ...co, x: parseFloat(co?.lat), y: parseFloat(co?.lng), r: 5 }));
    stateDecrease.sort((a, b) => {
      if (a?.state < b?.state) return -1;
      if (a?.state > b?.state) return 1;
      return 0;
    });
    const cityIncrease = response?.data?.coordinates?.map((co, index) => ({ ...co, x: parseFloat(co?.lat), y: parseFloat(co?.lng), r: 5 }));
    cityIncrease.sort((a, b) => {
      if (a?.country > b?.country) return -1;
      if (a?.country < b?.country) return 1;
      return 0;
    });
    setCharts({
      ...charts,
      byStateDecrease: stateDecrease,
      byCityIncrease: cityIncrease,
    });
  }

  const handleFetchCoordinatesPaginated = async () => {
    const response = await getCoordinatesPaginated({ token: userData?.token?.data?.jwt, limit, page, query });
    if (!response?.data && !response?.data?.coordinates && !Array.isArray(response?.data?.coordinates) && isLoadingPaginated) {
      notify("No se pudieron obtener las coordenadas seleccionadas");
      return;
    }
    const tableData = response?.data?.coordinates?.map(ele => ([ele?.eco, ele?.lat, ele?.lng, ele?.state, ele?.country])) ?? [];
    setRows(tableData);
    setFilteredCoordinates(response?.data?.coordinates);
    setTotalEntries(response?.data?.total);
  }

  const handleDownloadCoordinates = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({ token: userData?.token?.data?.jwt, limit, page, query });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    fetch("http://127.0.0.1:8000/coordinate/paginated/download", requestOptions)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${Date.now()}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => console.error(error));
  }

  const handleClearButtonClick = useCallback(() => setQuery(''), []);

  return (
    <Page
      title="TRACKER"
      fullWidth
      titleMetadata={<Badge tone="success">Activo</Badge>}
    >
      <ToastContainer />
      <div className="grid grid-cols-2 grid-rows-2 gap-5">
        <div className="border rounded-md border-gray-300">
          <Page
            title="Coordenadas"
            fullWidth
            primaryAction={
              <Button
                icon={<IconTable />}
                variant="primary"
                onClick={handleDownloadCoordinates}
                disabled={rows?.length === 0 || isLoadingPaginated}
              >
                Excel
              </Button>
            }
          >
            <LegacyCard>
              <TextField
                placeholder="Buscar"
                autoComplete="off"
                value={query}
                onChange={(e) => {
                  setQuery(e);
                }}
                clearButton
                onClearButtonClick={handleClearButtonClick}
              />
              <DataTable
                columnContentTypes={[
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                ]}
                headings={[
                  'ECO',
                  'LAT',
                  'LNG',
                  'STATE',
                  'COUNTRY',
                ]}
                rows={rows}
                pagination={{
                  hasNext: rows?.length > 9,
                  onNext: () => setPage((current) => current + 1),
                  hasPrevious: page > 1,
                  onPrevious: () => setPage((current) => current - 1),
                }}
              />
            </LegacyCard>
          </Page>
        </div>
        <div className="border rounded-md border-gray-300">
          <Page
            title="Mapa"
            fullWidth
          >
            <LegacyCard sectioned>
              <Button onClick={() => navigate("/tracker/map")}>Ver mapa</Button>
              <FooterHelp>
                La librería que utilicé para el mapa, <b>Leaflet</b>, tenía un error de renderizado en contenedores pequeños (necesitaba un <b>vh de 100</b>), por ende lo moví a otra página para que la vista estuviera bien.{' '}
                <Link url="https://github.com/PaulLeCam/react-leaflet/issues/1052" target="_blank">
                  Lo solucioné así.
                </Link>
              </FooterHelp>
            </LegacyCard>
          </Page>
        </div>
        <div className="border rounded-md border-gray-300">
          <Page
            title=""
          >

          </Page>
        </div>
        <div>4</div>
      </div>
    </Page>
  );
}