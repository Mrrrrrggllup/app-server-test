import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface EnhancedTableToolbarProps {
    numSelected: number;
    handleClickPlay: () => void;
      handleClickStop: () => void;
      handleClickEdit: () => void;
      handleClickDelete: () => void;
  }
  
  function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, handleClickDelete, handleClickEdit, handleClickPlay, handleClickStop } = props;

    function displayPlayStopIcon(handleClickPlay: any, handleClickStop: any) {
        return (
            <>
            <Tooltip title="Start Server">
            <IconButton onClick={handleClickPlay}>
              <PlayArrowIcon sx={{color: "RGB(100, 35, 165)"}}/>
            </IconButton>
          </Tooltip>
            <Tooltip title="Stop Server">
            <IconButton onClick={handleClickStop}>
                <StopIcon sx={{color: "red"}}/>
            </IconButton>
            </Tooltip>
          </>
        );
    }

    function displayActionButton(selectedNumber: number, handleClickPlay: any, handleClickStop: any, handleClickEdit: any, handleClickDelete: any) {
        if (selectedNumber === 0) {
            return (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            );
        } 
        
        if (selectedNumber === 1) {
            return (
                <>
                {displayPlayStopIcon(handleClickPlay, handleClickStop)}
                <Tooltip title="Update">
                <IconButton onClick={handleClickEdit}>
                  <EditIcon sx={{color: 'green'}}/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={handleClickDelete}>
                  <DeleteIcon sx={{color: 'black'}}/>
                </IconButton>
              </Tooltip>
              </>
            );
          }
    
          return (
            <>
            {displayPlayStopIcon(handleClickPlay, handleClickStop)}
            <Tooltip title="Delete">
                <IconButton onClick={handleClickDelete}>
                  <DeleteIcon sx={{color: 'black'}}/>
                </IconButton>
              </Tooltip>
              </>
          )
    
    }
  
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            <h3>Your server list</h3>
          </Typography>
        )}
        {displayActionButton(numSelected, handleClickPlay, handleClickStop, handleClickEdit, handleClickDelete  )}
      </Toolbar>
    );
  }

  export default EnhancedTableToolbar;