import "./Modal.css"

const Modal = ({children, isOpen, closeModal, icon}) =>{
    const handleModalContainerClick = (e) => e.stopPropagation();
    return (
     <article className = {`modal ${isOpen && "is-open"}`} onClick = {closeModal}>
       <div className = "modal-container" onClick = {handleModalContainerClick}>
        <div className="modal-close" onClick={closeModal}> {icon}  </div>
         {children}   
       </div>  
     </article>
    );
 };
 
 export default Modal;