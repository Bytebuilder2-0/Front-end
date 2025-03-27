import AppointmentForm from '../../components/AppoinmentForm' 

function AppointmentSubmit() {
 
  //Hardcode UserId
  const userId = "67c35eec60d77944a4fe5cf3"; 
  return (
    

    <>
    
     <AppointmentForm userId={userId} />

    </>
  );
}

export default AppointmentSubmit;
