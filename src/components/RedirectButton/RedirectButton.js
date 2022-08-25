import "./RedirectButton.css";

const RedirectButton = (props) => {
  return(
    <>
    <div className="purpleBox shadowBox redirectbutton-button">
      {props.text}
      <div className="redirectbutton-icon">
        {props.icon}
      </div>
    </div>
    </>
  );
}

export default RedirectButton;