import { useState, useEffect } from 'react';
import partnerService from '../services/partnerServices';
import ViewRequestPopup from './ViewRequestPopup';
import { 
  Store, 
  Bike, 
  ChevronRight, 
  Mail, 
  UserCircle, 
  Car,
  AlertCircle,
  MapPin
} from 'lucide-react';

const PendingRequests = () => {
  const [activeTab, setActiveTab] = useState('restaurant');
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const fetchPendingPartners = async () => {
    setLoading(true);
    try {
      const response = await partnerService.getAllPartners();
      if (response.success) {
        // Filter partners with "pending" status
        const pendingPartners = response.data.filter(partner => 
          partner.status && partner.status.toLowerCase() === 'pending'
        );
        setPartners(pendingPartners);
        console.log('Pending partners:', pendingPartners);
      } else {
        setError(response.message || 'Failed to fetch partners');
      }
    } catch (err) {
      setError('An error occurred while fetching partners');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPartners();
  }, []);

  const filteredPartners = partners.filter(partner => {
    if (activeTab === 'restaurant') {
      return partner.role === 'restaurant_owner' ;
    } else {
      return partner.role === 'delivery_rider';
    }
  });

  const handleViewMore = (partnerId) => {
    const partner = partners.find(p => p._id === partnerId);
    if (partner) {
      setSelectedPartner(partner);
      setShowPopup(true);
    }
  };

  const handleActionComplete = (action) => {
    console.log(`Partner ${action}: ${selectedPartner._id}`);
    setShowPopup(false);
    setSelectedPartner(null);
    // Refresh the list of pending partners
    fetchPendingPartners();
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedPartner(null);
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg shadow-md p-6 transition-all duration-300">
        <h2 className="text-2xl font-bold text-headingColor mb-6">Pending Partner Requests</h2>
        <div className="flex flex-col justify-center items-center min-h-[400px]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-cartNumBg"></div>
            <div className="absolute top-0 right-0 h-4 w-4 rounded-full bg-cartNumBg animate-pulse"></div>
          </div>
          <p className="mt-4 text-textColor font-medium">Loading partner requests...</p>
          <p className="text-sm text-lighttextGray">Please wait while we fetch the data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-cardOverlay p-4 rounded-md flex items-center gap-3 text-cartNumBg">
        <AlertCircle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-md p-6 transition-all duration-300">
      
      <p className="text-sm text-lighttextGray mb-4">Manage your pending partner requests here.</p>
      
      {/* Tab Navigation */}
      <div className="flex mb-6 border-b">
        <button
          onClick={() => setActiveTab('restaurant')}
          className={`flex items-center justify-center gap-2 px-6 py-3 font-medium text-sm transition-all duration-300 border-b-2 ${
            activeTab === 'restaurant' 
              ? 'border-cartNumBg text-cartNumBg' 
              : 'border-transparent text-lighttextGray hover:text-textColor'
          }`}
        >
          <Store size={18} />
          Restaurants
        </button>
        <button
          onClick={() => setActiveTab('delivery')}
          className={`flex items-center justify-center gap-2 px-6 py-3 font-medium text-sm transition-all duration-300 border-b-2 ${
            activeTab === 'delivery' 
              ? 'border-cartNumBg text-cartNumBg' 
              : 'border-transparent text-lighttextGray hover:text-textColor'
          }`}
        >
          <Bike size={18} />
          Delivery Partners
        </button>
      </div>
      
      {/* Content Section */}
      {filteredPartners.length === 0 ? (
        <div className="text-center py-10 text-lighttextGray">
          <div className="flex justify-center mb-4">
            {activeTab === 'restaurant' ? (
              <Store size={48} className="text-lighttextGray" />
            ) : (
              <Bike size={48} className="text-lighttextGray" />
            )}
          </div>
          <p>No pending {activeTab === 'restaurant' ? 'restaurant' : 'delivery partner'} requests found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPartners.map((partner) => (
            <div 
              key={partner._id} 
              className="bg-primary rounded-lg p-5 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02] border border-cardOverlay"
            >
              {activeTab === 'restaurant' ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <Store className="text-cartNumBg" size={22} />
                    <h3 className="font-semibold text-headingColor truncate">
                      {partner.restaurant.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-textColor mb-2">
                    <Mail size={16} />
                    <span className="truncate">{partner.email}</span>
                  </div>
                  <div className="text-sm flex gap-2 text-lighttextGray mb-4">
                  <MapPin size={16} />
                    {partner.restaurant.city && <p> {partner.restaurant.city}</p>}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <UserCircle className="text-cartNumBg" size={22} />
                    <h3 className="font-semibold text-headingColor truncate">
                      {partner.riderName || partner.name || `${partner.firstname || ''} ${partner.lasttname || ''}`.trim() || partner.email.split('@')[0]}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-textColor mb-2">
                    <Mail size={16} />
                    <span className="truncate">{partner.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-textColor mb-4">
                    <Car size={16} />
                    <span>{partner.vehicleType || 'Vehicle not specified'}</span>
                  </div>
                </>
              )}
              
              <button 
                onClick={() => handleViewMore(partner._id)}
                className="flex items-center justify-center w-full mt-2 py-2 bg-cardOverlay hover:bg-card text-cartNumBg rounded-md transition-colors duration-200 font-medium text-sm"
              >
                View More <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* View Request Popup */}
      {showPopup && selectedPartner && (
        <ViewRequestPopup 
          partner={selectedPartner} 
          onClose={handleClosePopup}
          onActionComplete={handleActionComplete}
        />
      )}
    </div>
  );
};

export default PendingRequests;
