import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, redirect } from "react-router-dom";
import { Badge, Button, DataTable, LegacyCard, Page, TextField, FooterHelp, Link } from "@shopify/polaris";
import { useGetCoordinatesMutation, useGetCoordinatesPaginatedMutation } from "../../stores/CoordinateStore";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BubbleChart from "./components/BubbleChart";
import ChangePasswordModal from "./modals/ChangePasswordModal";

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

function IconPdf(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023.479 0 .774-.242.774-.651 0-.366-.254-.586-.704-.586zm3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018.817.006 1.349-.444 1.349-1.396.006-.83-.479-1.268-1.255-1.268z" />
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM9.498 16.19c-.309.29-.765.42-1.296.42a2.23 2.23 0 01-.308-.018v1.426H7v-3.936A7.558 7.558 0 018.219 14c.557 0 .953.106 1.22.319.254.202.426.533.426.923-.001.392-.131.723-.367.948zm3.807 1.355c-.42.349-1.059.515-1.84.515-.468 0-.799-.03-1.024-.06v-3.917A7.947 7.947 0 0111.66 14c.757 0 1.249.136 1.633.426.415.308.675.799.675 1.504 0 .763-.279 1.29-.663 1.615zM17 14.77h-1.532v.911H16.9v.734h-1.432v1.604h-.906V14.03H17v.74zM14 9h-1V4l5 5h-4z" />
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
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  useEffect(() => {
    if (!userData || !userData?.isLogged) {
      navigate("/");
      return;
    }
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
      if (a?.eco > b?.eco) return -1;
      if (a?.eco < b?.eco) return 1;
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
      titleMetadata={<Badge tone={userData?.user?.is_logged ? "success" : "critical"}>{userData?.user?.is_logged ? "Activo" : "Inactivo"}</Badge>}
      subtitle={<><b>Usuario:</b>{" "}{userData?.user?.name}</>}
      primaryAction={{ content: "Reporte", icon: (<IconPdf />), onAction: () => { } }}
      secondaryActions={[
        {
          content: 'Cambiar contraseña',
          onAction: () => setShowChangePasswordModal(true),
        },
      ]}
    >
      <ToastContainer />
      <div className="grid grid-cols-2 grid-rows-2 gap-5 pb-5">
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
              <Button onClick={() => navigate(`/map/${limit}/${page}/${!query || query === "" ? "empty" : query}`)}>Ver mapa</Button>
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
            title="Gráfico por estado"
            subtitle="Ordenados por nombre de menor a mayor, y por latitud y logitud."
            fullWidth
          >
            <BubbleChart chart={charts?.byStateDecrease} label="Por Estado" sort="state" />
          </Page>
        </div>
        <div className="border rounded-md border-gray-300">
          <Page
            title="Gráfico por ciudad"
            subtitle="Ordenados por nombre de mayor a menor, y por latitud y logitud."
            fullWidth
          >
            <BubbleChart chart={charts?.byCityIncrease} label="Por Ciudad" sort="country" />
          </Page>
        </div>
      </div>
      {
        showChangePasswordModal && (
          <ChangePasswordModal
            open={showChangePasswordModal}
            onClose={() => {
              setShowChangePasswordModal(false);
            }}
            userData={userData}
          />
        )
      }
    </Page>
  );
}