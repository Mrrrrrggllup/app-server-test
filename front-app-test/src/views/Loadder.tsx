import styled from "styled-components";
import { Audio } from  'react-loader-spinner'

const LoadderBloc = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    margin-top: 15%;
    align-items: center;
}`

function Loadder() {
    return (
        <LoadderBloc>
            <Audio />
        </LoadderBloc>)
}

export default Loadder;