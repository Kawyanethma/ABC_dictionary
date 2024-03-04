import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#242424',
      color: '#d1d0c5',
      maxWidth: 160,
      padding: theme.spacing(2),
      marginLeft: theme.spacing(1.5),
      fontSize: theme.typography.pxToRem(12),
    },
  }));

  export default HtmlTooltip;