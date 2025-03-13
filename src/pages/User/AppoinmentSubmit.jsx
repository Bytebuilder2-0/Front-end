import AppointmentForm from '../../components/AppoinmentForm' 

function AppointmentSubmit() {
 
  //Hardcode UserId
  const userId = "67c3619460d77944a4fe5cf5"; 
  return (
    

    <>
    
     <AppointmentForm userId={userId} />

    </>
  );
}

export default AppointmentSubmit;
