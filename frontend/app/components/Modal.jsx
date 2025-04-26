export default function Modal({ data, onClose }) {
	if (!data) return null;
	return (
	  <div className="modal">
		<div className="modal-content">
		  <button className="close-btn" onClick={onClose}>×</button>
		  <pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
		<style jsx>{`
		  .modal {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.5);
			display: flex;
			align-items: center;
			justify-content: center;
		  }
		  .modal-content {
			background: white;
			padding: 2rem;
			border-radius: 1rem;
			max-width: 90%;
			max-height: 80%;
			overflow: auto;
			position: relative;
		  }
		  .close-btn {
			position: absolute;
			top: 0.5rem;
			right: 0.5rem;
			font-size: 1.5rem;
			background: none;
			border: none;
			cursor: pointer;
		  }
		`}</style>
	  </div>
	);
  }
