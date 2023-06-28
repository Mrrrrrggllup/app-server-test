import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createServer, fetchServer, updateServer } from "../service/apiService";
import Loadder from '../views/Loadder';
import styled from 'styled-components';
import Server, { ServerStatus, ServerType } from '../interfaces/Server';
import { Autocomplete, TextField } from '@mui/material';
import Button from '@mui/material/Button';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 8%;
`;

const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const StyledSelectBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 50px;
    width: 700px;
    justify-content: space-between;
`;

const StyledInput = styled(TextField)`
  width: 300px;
  margin-bottom: 10px;
`;

const ServerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [server, setServer] = useState<any>({});
  const serverTypes: Array<ServerType> = ['small', 'medium', 'large'];
  const serverStatus: Array<ServerStatus> = ['starting' , 'running' , 'stopping' , 'stopped'];

  function upsertServer() {
    if (server.id) {
        // update
        updateServer(server)
        .then((data) => {
            console.log(data, "madata");
            setServer(data);
        });
    } else {
        // create
        createServer(server)
        .then((data: Server) => {
            console.log(data, "madata");
            setServer(data);
        });
    }
}

  useEffect(() => {
    if (id) {
        fetchServer(+id)
        .then((data) => {
            setServer(data);
            });
    }
  }, [id]);

  if (!server) {
    return (<Loadder />);
  }

  return (
    <StyledContainer>
      <h3>{server.name || 'New server'} {`#${server.id}` || ''}</h3>
      <StyledForm>
        <StyledInput
          required
          id="outlined-required"
          onChange={(e: any) => setServer({...server, name: e.target.value})}
          label="Required"
          value={server.name || 'Server Name'}
        />
        <StyledSelectBox>
        <Autocomplete
          disablePortal
          aria-required
          id="combo-box-type"
          options={serverTypes}
          onChange={(e: any, value) => setServer({...server, type: value})}
          value={server.type || ''}
          sx={{ width: 300 }}
          renderInput={(params) => <StyledInput {...params} label="Type" required />}
        />
        <Autocomplete
          disablePortal
          id="combo-box-status"
          options={serverStatus}
          onChange={(e, value) => setServer({...server, status: value})}
          value={server.status || ''}
          sx={{ width: 300 }}
          renderInput={(params) => <StyledInput {...params} label="Status" />}
        />
        </StyledSelectBox>
        <Button variant="contained" href="#contained-buttons" sx={{marginTop : "50px"}} onClick={upsertServer}>
            {server.id ? 'Update' : 'Create'}
      </Button>
      </StyledForm>
    </StyledContainer>
  );
};

export default ServerDetail;