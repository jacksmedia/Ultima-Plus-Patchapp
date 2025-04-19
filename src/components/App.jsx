import { useState, useEffect } from 'react';
import Header from './Header';
import Spinner from './Spinner';
// import RomUploader from './RomUploader';
// import PatchDropdown from './PatchDropdown';
import PatchInfo from './PatchInfo';
import Promos from './Promos';
import Footer from './Footer';

function App() {
  const [romData, setRomData] = useState(null);
  const [zip, setZip] = useState(null);
  const [crcHex, setCrcHex] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedPatch, setSelectedPatch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Header />
      {isLoading && <Spinner />}
      <main className="container-fluid">
        <RomUploader
          setRomData={setRomData}
          setCrcHex={setCrcHex}
          crcHex={crcHex}
          romData={romData}
        />
        <PatchInfo crcHex={crcHex} />
        <PatchDropdown
          dropdownOptions={dropdownOptions}
          selectedPatch={selectedPatch}
          setSelectedPatch={setSelectedPatch}
          romData={romData}
          zip={zip}
          setIsLoading={setIsLoading}
        />
        <Promos />
        <Footer />
      </main>
    </>
  );
}

export default App;
