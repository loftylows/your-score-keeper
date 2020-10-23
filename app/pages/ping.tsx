import { GetServerSideProps } from "blitz"

// health check URL
const Ping = () => {}

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.end("pong")
  return { props: {} }
}

export default Ping
