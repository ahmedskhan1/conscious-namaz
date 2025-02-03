
const Container = ({ className, children }) => {
  return (
    <div className={`px-5 md:px-10 xl:px-20 w-full ${className ?? ""}`}>{children}</div>
  )
}

export default Container