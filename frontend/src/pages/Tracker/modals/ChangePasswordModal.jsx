import { Divider, FormLayout, Modal, TextContainer, TextField } from "@shopify/polaris";
import { useState } from "react";


export default function ChangePasswordModal({ open, onClose, userData }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const handleClose = () => {
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Cambiar contraseña"
      primaryAction={{
        content: 'Cambiar',
        onAction: handleClose,
        destructive: true,
        disabled: (
          !form.currentPassword ||
          !form.newPassword
        )
      }}
      secondaryActions={[
        {
          content: 'Cancelar',
          onAction: handleClose,
        },
      ]}
    >
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