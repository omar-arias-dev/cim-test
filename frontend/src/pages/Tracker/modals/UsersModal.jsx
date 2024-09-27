import { useEffect, useState } from "react";
import { LegacyCard, Modal, Avatar, Card, Button, FormLayout, TextField, Select, Badge } from "@shopify/polaris";
import { useLazyAllUsersQuery, useDeleteUserMutation, useUpdateUserMutation, useCreateUserMutation } from "../../../stores/AuthStore";

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const selectableOptions = [
  { value: "", label: "Selecciona" },
  { value: "ADMIN", label: "Administrador" },
  { value: "AGENT", label: "Agente" },
];

function IconPlus(props) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm192 472c0 4.4-3.6 8-8 8H544v152c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V544H328c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h152V328c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v152h152c4.4 0 8 3.6 8 8v48z" />
    </svg>
  );
}

function IconTrash(props) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5v7a.5.5 0 01-1 0v-7a.5.5 0 011 0z" />
    </svg>
  );
}

function IconEdit(props) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32zm-622.3-84c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9z" />
    </svg>
  );
}

export default function UsersModal({ open, onClose, loggedUser }) {
  console.log({loggedUser})
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({
    id: null,
    name: "",
    email: "",
    role: "",
  });
  const [isCreate, setIsCreate] = useState(false);
  const [createData, setCreateData] = useState({
    password: "",
  });

  const [getAllUsers] = useLazyAllUsersQuery();
  const [deleteUser, { isLoading: isLoadingDelete }] = useDeleteUserMutation();
  const [updateUser, { isLoading: isLoadingUpdate }] = useUpdateUserMutation();
  const [createUser, { isLoading: isLoadingCreate }] = useCreateUserMutation();

  useEffect(() => {
    handleFetchUsers();
  }, []);

  const handleFetchUsers = async () => {
    const response = await getAllUsers();
    if (!response || !response?.data || !response?.data?.code || response?.data?.code !== 200 || !Array?.isArray(response?.data?.users)) return;
    const filteredUsers = response?.data?.users?.filter(user => user?.id !== loggedUser?.id) ?? [];
    setUsers(filteredUsers);
  }

  const handleDeleteUser = async (id) => {
    if (!id) return;
    const response = await deleteUser({ id });
    if (response && response?.data && response?.data?.code === 200) {
      await handleFetchUsers();
    }
  }

  const handleUpdateUser = async () => {
    const respose = await updateUser(selectedUser);
    if (respose?.data?.code && respose?.data?.code === 200) {
      setSelectedUser({
        id: null,
        name: "",
        email: "",
      });
      await handleFetchUsers();
    }
  }

  const handleCreateUser = async () => {
    const response = await createUser({
      ...selectedUser,
      ...createData,
    });
    if (response && response?.data && response?.data?.code && response?.data?.code === 201) {
      await handleFetchUsers();
      setSelectedUser({
        id: null,
        name: "",
        email: "",
        role: "",
      });
      setCreateData({
        password: "",
      });
      setIsCreate(false);
      await handleFetchUsers();
      return;
    }
  }

  const handleClose = () => {
    setSelectedUser({
      id: null,
      name: "",
      email: "",
      role: "",
    });
    setCreateData({
      password: "",
    });
    setIsCreate(false);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Usuarios"
      secondaryActions={[
        {
          content: 'Cerrar',
          onAction: handleClose,
          disabled: false,
        },
      ]}
    >
      <Modal.Section>
        <LegacyCard sectioned>
          {
            ((!selectedUser?.id && !selectedUser?.email && !selectedUser?.name) && !isCreate) && (
              <div className="pb-4 flex justify-end">
                <Button
                  onClick={() => {
                    setIsCreate(true);
                  }}
                  icon={<IconPlus width={20} height={20} />}
                >
                  Nuevo
                </Button>
              </div>
            )
          }
          {
            (selectedUser?.id || isCreate) ? (
              <FormLayout>
                <div className="flex justify-end">
                  <Button onClick={() => {
                    if (!isCreate) {
                      setSelectedUser({
                        id: null,
                        name: "",
                        email: "",
                        role: "",
                      });
                      return;
                    }
                    setSelectedUser({
                      id: null,
                      name: "",
                      email: "",
                    });
                    setCreateData({
                      password: "",
                    });
                    setIsCreate(false);
                  }}>
                    Regresar
                  </Button>
                </div>
                <TextField
                  label="nombre"
                  value={selectedUser?.name}
                  onChange={(e) => {
                    setSelectedUser({ ...selectedUser, name: e });
                  }}
                  error={!selectedUser?.name ? "El campo es olbigatorio" : ""}
                />
                <TextField
                  label="email"
                  value={selectedUser?.email}
                  onChange={(e) => {
                    setSelectedUser({ ...selectedUser, email: e });
                  }}
                  error={!selectedUser?.email ? "El campo es olbigatorio" : !emailRegex.test(selectedUser.email) ? "Email no válido" : ""}
                />
                <Select
                  label="Rol"
                  options={selectableOptions}
                  value={selectedUser?.role}
                  onChange={(v) => setSelectedUser({ ...selectedUser, role: v })}
                  error={!selectedUser?.role ? "El campo es obligatorio" : ""}
                />
                {
                  isCreate && (
                    <FormLayout>
                      <TextField
                        label="Contraseña"
                        type="password"
                        value={createData.password}
                        onChange={(e) => { setCreateData({ ...createData, password: e }) }}
                        error={!createData.password ? "El campo es obligatorio" : ""}
                      />
                    </FormLayout>
                  )
                }
                <div className="flex justify-center">
                  <Button
                    variant="primary"
                    disabled={
                      (!isCreate && (!selectedUser?.id || !selectedUser?.email || !selectedUser?.name || !selectedUser?.role || !emailRegex.test(selectedUser.email))) ||
                      (isCreate && (!selectedUser?.email || !selectedUser?.name || !emailRegex.test(selectedUser.email) || !createData.password || !selectedUser.role))
                    }
                    onClick={() => isCreate? handleCreateUser() : handleUpdateUser()}
                  >
                    Guardar
                  </Button>
                </div>
              </FormLayout>
            ) : users?.map(user => (
              <Card key={user?.id}>
                <div className="py-2 my-1 flex justify-between">
                  <div className="flex flex-col justify-center items-center">
                    <Avatar size="md" />
                    <div className="my-2">
                      <Badge progress="complete">{user?.role === "ADMIN" ? "Admin" : user?.role === "AGENT" ? "Agent" : ""}</Badge>
                    </div>
                    <div className="flex flex-col items-center">
                      <b>
                        {user?.name}
                      </b>
                      <b>
                        {user?.email}
                      </b>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mx-2">
                      <Button icon={<IconTrash />} onClick={async () => handleDeleteUser(user?.id)} tone="critical" variant="primary"></Button>
                    </div>
                    <div className="mx-2">
                      <Button
                        variant="primary"
                        onClick={() => {
                          console.log(user)
                          setSelectedUser({
                            ...selectedUser,
                            id: user?.id,
                            email: user?.email,
                            name: user?.name,
                            role: user?.role,
                          });
                        }}
                        icon={<IconEdit />}
                      >
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          }
        </LegacyCard>
      </Modal.Section>
    </Modal>
  );
}