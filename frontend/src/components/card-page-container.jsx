
const CardPageContainer = ({children}) =>{
  return (
  <div className="bg-gradient-to-b from-indigo-100 to-indigo-300 relative">
    <div className="fixed inset-0 bg-gradient-to-b from-indigo-100 to-indigo-300 -z-10" />
    {children}
    </div>)
}

export { CardPageContainer }

