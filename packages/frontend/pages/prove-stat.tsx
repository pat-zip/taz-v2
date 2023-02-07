import Layout from "../components/Layout";
import ProveStat from "../components/Reputation/ProveStat";

const ProveStatPage = () => (
  <Layout title="TAZ v2">
    <ProveStat stat={{ name: "Strength", color: "green", index: 0, bits: 8 }} minValue={1} />
  </Layout>
);

export default ProveStatPage;
