import "./RedirectButton.css";

const RedirectButton = (props) => {
  return (
    <>
      <a href={props.link}>
        <div className="purpleBox shadowBox redirectbutton-button">
          {props.text}
          <div className="redirectbutton-icon">{props.icon}</div>
        </div>
      </a>
    </>
  );
};

export default RedirectButton;
