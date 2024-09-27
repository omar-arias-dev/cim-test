import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Divider, FormLayout, Modal, TextContainer, TextField } from "@shopify/polaris";
import { useChangePasswordMutation } from "../../../stores/AuthStore";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notify = (message) => toast(message);

export default function ChangePasswordModal({ open, onClose, userData }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const handleClose = () => {
    if (isLoading) return;
    onClose();
  }

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleChangePassword = async () => {
    const response = await changePassword({ email: userData?.user?.email, current_password: form.currentPassword, new_password: form.newPassword });
    if (response?.data?.code !== 200) {
      if (response?.error?.data?.code === 404) {
        notify("No se encontró el usuario. Recargar");
      } else if (response?.error?.data?.code === 401) {
        notify("La contraseña actual es incorrecta");
      }
      return;
    }
    notify("Se cambió la contraseña correctamente");
    setTimeout(() => {
      localStorage.removeItem('userData');
      navigate("/");
    }, "1500");
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Cambiar contraseña"
      primaryAction={{
        content: 'Cambiar',
        onAction: handleChangePassword,
        destructive: true,
        disabled: (
          !form.currentPassword ||
          !form.newPassword ||
          isLoading
        )
      }}
      secondaryActions={[
        {
          content: 'Cancelar',
          onAction: handleClose,
          disabled: isLoading,
        },
      ]}
    >
      <ToastContainer />
      <Modal.Section>
        <TextContainer>
          <p>
          Este cambio es permanente y deberás utilizar la nueva contraseña para acceder a tu cuenta. Asegúrate de que sea una contraseña segura que puedas recordar.
          </p>
        </TextContainer>
        <div className="my-2">
          <Divider />
        </div>
        <FormLayout>
          <TextField
            label="Contraseña actual:"
            type="password"
            value={form.currentPassword}
            onChange={(e) => {
              setForm({ ...form, currentPassword: e });
            }}
            error={!form.currentPassword ? "Campo obligatorio" : ""}
          />
          <TextField
            label="Contraseña nueva:"
            type="password"
            value={form.newPassword}
            onChange={(e) => {
              setForm({ ...form, newPassword: e });
            }}
            error={!form.newPassword ? "Campo obligatorio" : ""}
          />
        </FormLayout>
      </Modal.Section>
    </Modal>
  );
}