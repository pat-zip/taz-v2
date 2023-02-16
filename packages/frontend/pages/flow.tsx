import Layout from "../components/Layout";
import Flow from "../components/Reputation/Flow";

const FlowPage = () => (
  <Layout title="TAZ v2">
    <Flow stat={{ name: "Strength", color: "green", index: 0, bits: 8 }} minValue={1} />
  </Layout>
);

export default FlowPage;
