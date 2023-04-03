const ProgressBar = (props) => {
    const { completed } = props;
  
    const containerStyles = {
      height: 10,
      /*width: '100%',*/
      backgroundColor: "#e0e0de",
      borderRadius: 50,
      /*margin: 50*/
    }
  
    const fillerStyles = {
      height: '100%',
      width: `${completed}%`,
      backgroundColor: '#4caf50',
      borderRadius: 'inherit',
      textAlign: 'right'
    }
  
    const labelStyles = {
      padding: 5,
      color: 'white',
      fontWeight: 'bold',
      display: 'none'
    }
  
    return (
      <div style={containerStyles}>
        <div style={fillerStyles}>
          <span style={labelStyles}>{`${completed}%`}</span>
        </div>
      </div>
    );
  };
  
  export default ProgressBar;