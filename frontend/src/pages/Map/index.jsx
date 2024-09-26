import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useGetCoordinatesMutation } from "../../stores/CoordinateStore";
import 'leaflet/dist/leaflet.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notify = (message) => toast(message);

export default function Map() {
  const userData = useSelector((state) => state.user);
  const [coordinates, setCoordinates] = useState([]);

  const [getCoordinates, { isLoading }] = useGetCoordinatesMutation();

  useEffect(() => {
    handleFetchCoordinates();
  }, []);

  const handleFetchCoordinates = async () => {
    const response = await getCoordinates({ token: userData?.token?.data?.jwt });
    if (!response?.data && !response?.data?.coordinates && !Array.isArray(response?.data?.coordinates) && isLoading) {
      notify("No se pudieron obtener las coordenadas");
      return;
    }
    const markers = response?.data?.coordinates?.map(co => ({
      geoCode: [parseFloat(co?.lat), parseFloat(co?.lng)],
      popUp: `${co?.country}, ${co?.state} = ${co?.eco} - ${co?.lat} - ${co?.lng}`,
    }));
    setCoordinates(markers);
  }

  return (
    <>
      <ToastContainer />
      {
        isLoading ? (
          <p>cargando</p>
        ) : coordinates?.length === 0 ? (
          <p>No hay coordenadas</p>
        ) : (
          <MapContainer style={{ height: 536 }} center={[51.505, -0.09]} zoom={13}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
              {
                coordinates?.map(marker => (
                  <Marker position={marker?.geoCode}>
                    <Popup>
                      {marker?.popUp ?? "-"}
                    </Popup>
                  </Marker>
                ))
              }
          </MapContainer>
        )
      }
    </>
  );
}
