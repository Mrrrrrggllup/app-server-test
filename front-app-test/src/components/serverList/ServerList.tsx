import React, { useEffect, useState } from 'react';
import useGestServers from '../../customHooks/useGetServers';
import styled from 'styled-components';
import ServerTable from '../table/ServerTable';
import Loadder from '../../views/Loadder';
import { deleteServer, deleteServers, updateServersStatus } from '../../service/apiService';
import { ServerStatus } from '../../interfaces/Server';
import { useNavigate } from 'react-router-dom';
import ModalConfirm from '../../views/ModalConfirm';

const TableBloc = styled.div`
    width: 60%;
    margin: 5% auto;
`;

function ServerList() {
  const {servers, loading, error, getServers} = useGestServers();
  const [selected, setSelected] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");

  function getServerByName(name: string) {
    return servers.find(server => server.name === name);
  }

  useEffect(() => {
    console.log("componentServerListOn");
  }, [])

  function getSelectedServerIds() {
    return selected.map(serverName => getServerByName(serverName))?.map(x => {
        if (x) {
            return x.id;
        }
    }).filter(x => x !== undefined) as number[];
  }

  function updateServersWithStatus(status: ServerStatus) {
    let ids = getSelectedServerIds();
    updateServersStatus({ids, status})
    .then(() => {
        getServers();
        setSelected([]);
    });
  }

  function handleStart() {
    updateServersWithStatus("running");
  }

    function handleStop() {
    updateServersWithStatus("stopped");
    }

    function handleDeleteServer() {
      setModalMessage("Are you sure you want to delete this server(s)?");
      setModalTitle("Delete Server(s) ?");
        setOpenModal(true);
    }

      function handleDeleteServerValidate() {
      setOpenModal(false);
        if (selected.length > 1) {
            let ids = getSelectedServerIds();
            deleteServers(ids)
            .then(() => {
                setSelected([]);
                getServers();
            });
        } else if (selected.length === 1) {
            const server = getServerByName(selected[0]);
            if (server) {
                deleteServer(server.id)
                .then(() => {
                    setSelected([]);
                    getServers();
                });
            }
        }
    }

    function handleEdit() {
        if (selected.length === 1) {
            const id = getServerByName(selected[0])?.id;
            console.log(id);
            if (id) {
                navigate(`server/${id}`);
            }
        }
    }


  useEffect(() => {
    console.log(error);
  }, [error])

  if (loading) {
    return (
        <Loadder />) 
  }
  
  return (
    
    <TableBloc>
      <ServerTable rows={servers} selected={selected} setSelected={setSelected} handleClickPlay={handleStart} 
      handleClickStop={handleStop} handleClickDelete={handleDeleteServer} handleClickEdit={handleEdit}/>
      <ModalConfirm message={modalMessage} isOpen={openModal} 
      setIsOpen={setOpenModal} onConfirm={handleDeleteServerValidate} onCancel={() => setOpenModal(false)} title={modalTitle}/>
    </TableBloc>
    
    
  );
};

export default ServerList;