export default function Button({ id, name, description, image, onClick }) {
	return (
	  <button className="btn" onClick={() => onClick(name, description, image)}>
		{id}
	  </button>
	);
  }
