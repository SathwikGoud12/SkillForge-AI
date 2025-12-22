const Overview = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Total Domains" value="6" />
        <Card title="Total Users" value="1,245" />
        <Card title="Active Learners" value="820" />
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow">
    <p className="text-gray-500">{title}</p>
    <h3 className="text-xl font-semibold">{value}</h3>
  </div>
);

export default Overview;
