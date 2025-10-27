export default function BuddyCard({ avatar, name, mutuals, onClick }) {
  return (
    <div className="card" onClick={onClick} style={{ cursor: "pointer" }}>
      <img className="buddy__avatar" src={avatar} alt={name} />
      <div>
        <div className="buddy__name">{name}</div>
        <div className="buddy__mutuals">{mutuals} mutual connections</div>
      </div>
    </div>
  );
}
