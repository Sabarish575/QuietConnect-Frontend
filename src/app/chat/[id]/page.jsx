
import Chat from "../Chat";
import Header2 from "../../../../Components/Header2";
import Footer2 from "../../../../Components/Footer2";


export default async function Page({ params }) {
  const { id } = await params;


  return(
    <div className='flex flex-col justify-between bg-[#0e1113] h-screen'>
        <Header2/>
        <Chat autoOpenUserId={id}/>
        <Footer2/>
    </div>
  )
}