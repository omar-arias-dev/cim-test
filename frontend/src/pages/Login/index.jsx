import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { login as setLoginData } from './../../slices/UserSlice';
import { Button, FormLayout, LegacyCard, Page, TextField } from "@shopify/polaris";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLazyLoginQuery } from "../../stores/AuthStore";

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const notify = (message) => toast(message);

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [login, { isLoading }] = useLazyLoginQuery();

  useEffect(() => {
    const userStorage = localStorage?.getItem("userData") ?? null;
    const userObject = JSON?.parse(userStorage) ?? null;
    if (!userStorage || !userObject) return;
    dispatch(setLoginData(userObject));
    navigate("/tracker");
  }, []);

  const handleLoginClick = async () => {
    if (!form.email || !form.password) {
      notify("Campos aún sin llenar");
      return;
    };
    if (!emailRegex.test(form.email)) {
      notify("El email no es un correo válido");
      return;
    };
    const response = await login(form);
    if (response?.isError) {
      notify("Error al inciar sesión");
      return;
    };
    if (response?.data?.data?.token?.data?.jwt && response?.data?.data?.user) {
      const userObject = { token: response?.data?.data?.token, user: response?.data?.data?.user, isLogged: true };
      dispatch(setLoginData(userObject));
      localStorage.setItem("userData", JSON.stringify(userObject));
      navigate("/tracker");
      return;
    } else {
      notify("Credenciales incorrectas");
      return;
    }
  }

  return (
    <Page
      title="Examen Desarrollador CIM"
      subtitle="Oscar Omar Arias Rodríguez"
    >
      <ToastContainer />
      <LegacyCard title="Login" sectioned>
        <FormLayout>
          <TextField
            type="email"
            label="email"
            onChange={(e) => {
              setForm({ ...form, email: e });
            }}
            value={form.email}
            error={!form.email ? "Email obligatorio" : !emailRegex.test(form.email) ? "email no válido" : "" }
          />
          <TextField
            type="password"
            label="contraseña"
            onChange={(e) => {
              setForm({ ...form, password: e });
            }}
            value={form.password}
            error={!form.password ? "Contraseña obligatoria" : "" }
          />
          <Button disabled={isLoading} variant="primary" onClick={async () => await handleLoginClick()}>Login</Button>
        </FormLayout>
      </LegacyCard>
    </Page>
  );
}