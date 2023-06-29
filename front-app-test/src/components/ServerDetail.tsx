import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createServer, fetchServer, updateServer } from "../service/apiService";
import Loadder from '../views/Loadder';
import styled from 'styled-components';
import Server, { ServerStatus, ServerType } from '../interfaces/Server';
import { Autocomplete, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { isAbsent } from '../utils/ValidateData';
import Toaster from '../views/Toaster';
import { useNavigate } from 'react-router-dom';
import ApiResponse from '../interfaces/ApiResponse';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 8%;
`;

const StyledForm = styled.form`
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
  const [loading, setLoading] = useState<boolean>(false);
  const serverTypes: Array<ServerType> = ['small', 'medium', 'large'];
  const serverStatus: Array<ServerStatus> = ['starting' , 'running' , 'stopping' , 'stopped'];
  const [errors, setErrors] = useState<any>({});
  const [toast, setToast] = useState<any>({});
  const navigate = useNavigate();

  function validate() : boolean {
    let errors: any = {};
    errors.type = isAbsent(server.type);
    errors.status = isAbsent(server.status);
    errors.name = isAbsent(server.name);
    setErrors(errors);
    return !errors.type && !errors.status && !errors.name;
  }

  function handleErrorReturnAndContinue(error: string) {
    console.log(error);
    if (error) {
      setToast({message: error, type: 'error'});
      if (error.includes('already exists')) {
        setErrors({...errors, nameAlreadyExist: true});
      }
      return false;
    } else {
      setErrors({...errors, nameAlreadyExist: false});
      return true;
    }
  }

  function getHelperTextName() {
    if (errors.nameAlreadyExist) {
      return "Name already exist";
    } 

    if (errors.name) {
      return "Required";
    }

    return '';
  }

  function upsertServer() {
    setLoading(true);
    let isValid = validate();
    if (!isValid) {
      setLoading(false);
      return;
    }
    if (server.id) {
        // update
        updateServer(server)
        .then((res) => {
            if (handleErrorReturnAndContinue(res.error)) {
              setServer(res.data.body);
              setToast({message: 'Server updated successfully', type: 'success'});
              navigate(`/`);
            }
            setLoading(false);
        });
    } else {
        // create
        createServer(server)
        .then((res: ApiResponse<Server>) => {
          if (handleErrorReturnAndContinue(res.error)) {
            setServer(res.data.body);
            setToast({message: 'Server created successfully', type: 'success'});
            navigate(`/`);
          }
          setLoading(false);
        });
    }
}

  useEffect(() => {
    if (id) {
        fetchServer(+id)
        .then((res) => {
            if (handleErrorReturnAndContinue(res.error)) {
              setServer(res.data.body);
            }
        });
    }
  }, [id]);

  if (!server) {
    return (<Loadder />);
  }

  return (
    <StyledContainer>
      <Toaster toast={toast}/>
      <h3>{server.id ? server.name : 'New server'} {server.id ? `#${server.id}` : ''}</h3>
      <StyledForm >
        <StyledInput
          error={errors.name || errors.nameAlreadyExist}
          required
          id="outlined-required"
          onChange={(e: any) => setServer({...server, name: e.target.value})}
          label="Name"
          helperText={getHelperTextName()}
          value={server.name || ''}
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
          
          renderInput={(params) => <StyledInput {...params} label="Type" required error={errors.type} helperText={errors.type ? "Required" : ''}/>}
        />
        <Autocomplete
          disablePortal
          id="combo-box-status"
          options={serverStatus}
          onChange={(e, value) => setServer({...server, status: value})}
          value={server.status || ''}
          sx={{ width: 300 }}
          renderInput={(params) => <StyledInput {...params} error={errors.status} label="Status" required helperText={errors.status ? "Required" : ''}/>}
        />
        </StyledSelectBox>
        <Button variant="contained" href="#contained-buttons" sx={{marginTop : "50px"}} onClick={upsertServer} disabled={loading}>
            {server.id ? 'Update' : 'Create'}
      </Button>
      </StyledForm>
    </StyledContainer>
  );
};

export default ServerDetail;