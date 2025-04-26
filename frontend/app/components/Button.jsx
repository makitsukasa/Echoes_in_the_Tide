export default function Button({ id, tokenURI, onClick }) {
	return (
	  <button className="btn" onClick={() => onClick(tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/"))}>
		{id}
	  </button>
	);
  }
