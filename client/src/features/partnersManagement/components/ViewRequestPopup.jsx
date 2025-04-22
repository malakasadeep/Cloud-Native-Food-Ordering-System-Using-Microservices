import { useState } from 'react';
import { 
  Store, 
  Bike, 
  Mail, 
  Phone, 
  User as UserIcon, 
  Car,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  FileImage,
  CreditCard,
  X,
  AlertCircle,
  Loader
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import partnerService from '../services/partnerServices';

const ViewRequestPopup = ({ partner, onClose, onActionComplete }) => {
  const [processing, setProcessing] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
  const [error, setError] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const isRestaurant = partner.role === 'restaurant_owner';

  const handleApprove = async () => {
    setProcessing(true);
    setActionType('approve');
    setError(null);
    
    try {
      const response = await partnerService.updatePartnerStatus(partner._id, 'approved');
      if (response.success) {
        toast.success(`${isRestaurant ? 'Restaurant' : 'Delivery'} partner approved successfully!`);
        onActionComplete('approved');
      } else {
        setError(response.message || 'Failed to approve partner');
      }
    } catch (err) {
      setError('An error occurred while approving partner');
      console.error(err);
    } finally {
      setProcessing(false);
      setActionType(null);
    }
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const submitRejection = async () => {
    setProcessing(true);
    setActionType('reject');
    setError(null);
    
    try {
      const response = await partnerService.updatePartnerStatus(partner._id, 'rejected', rejectReason);
      if (response.success) {
        toast.success(`${isRestaurant ? 'Restaurant' : 'Delivery'} partner rejected`);
        setShowRejectModal(false);
        onActionComplete('rejected');
      } else {
        setError(response.message || 'Failed to reject partner');
      }
    } catch (err) {
      setError('An error occurred while rejecting partner');
      console.error(err);
    } finally {
      setProcessing(false);
      setActionType(null);
    }
  };

  // Rejection reason modal
  const RejectReasonModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-headingColor flex items-center gap-2">
            <XCircle size={20} className="text-red-500" />
            Rejection Reason
          </h3>
          <button 
            onClick={() => setShowRejectModal(false)}
            className="text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 p-1"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <p className="text-textColor mb-3">
          Please provide a reason for rejecting this partner application:
        </p>
        
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Enter rejection reason..."
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 min-h-[120px]"
        />
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mt-3 rounded">
            <p className="flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </p>
          </div>
        )}
        
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setShowRejectModal(false)}
            className="py-2 px-6 rounded-md bg-gray-100 text-gray-600 font-medium hover:bg-gray-200"
            disabled={processing}
          >
            Cancel
          </button>
          <button
            onClick={submitRejection}
            disabled={processing || !rejectReason.trim()}
            className="py-2 px-6 rounded-md bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
          >
            {processing && actionType === 'reject' ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <XCircle size={16} />
            )}
            Send
          </button>
        </div>
      </div>
    </div>
  );

  // Main component render
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Header */}
        <div className="border-b p-4 flex justify-between items-center bg-primary rounded-t-lg sticky top-0 z-10">
          <div className="flex items-center gap-2">
            {isRestaurant ? (
              <Store className="text-cartNumBg" size={24} />
            ) : (
              <Bike className="text-cartNumBg" size={24} />
            )}
            <h2 className="text-xl font-bold text-headingColor">
              {isRestaurant ? 'Restaurant Partner Request' : 'Delivery Partner Request'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 p-1"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Basic Information */}
          <div className="mb-6 bg-primary p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-headingColor mb-3 border-b pb-2 flex items-center gap-2">
              <UserIcon size={18} className="text-cartNumBg" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-cartNumBg" />
                <span className="text-textColor font-medium">Email:</span>
                <span className="text-lighttextGray">{partner.email}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <UserIcon size={18} className="text-cartNumBg" />
                <span className="text-textColor font-medium">Name:</span>
                <span className="text-lighttextGray">
                  {partner.firstname || ''} {partner.lasttname || ''}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone size={18} className="text-cartNumBg" />
                <span className="text-textColor font-medium">Mobile:</span>
                <span className="text-lighttextGray">{partner.mobile || 'Not provided'}</span>
              </div>

              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-cartNumBg" />
                <span className="text-textColor font-medium">NIC:</span>
                <span className="text-lighttextGray">{partner.nic || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {/* Restaurant-specific information */}
          {isRestaurant && partner.restaurant && (
            <div className="mb-6 bg-primary p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-headingColor mb-3 border-b pb-2 flex items-center gap-2">
                <Store size={18} className="text-cartNumBg" />
                Restaurant Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Store size={18} className="text-cartNumBg" />
                  <span className="text-textColor font-medium">Name:</span>
                  <span className="text-lighttextGray">{partner.restaurant.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-cartNumBg" />
                  <span className="text-textColor font-medium">City:</span>
                  <span className="text-lighttextGray">{partner.restaurant.city || 'Not provided'}</span>
                </div>

                <div className="col-span-2 flex items-start gap-2">
                  <MapPin size={18} className="text-cartNumBg mt-1" />
                  <span className="text-textColor font-medium mt-0.5">Address:</span>
                  <span className="text-lighttextGray">{partner.restaurant.address || 'Not provided'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-cartNumBg" />
                  <span className="text-textColor font-medium">Opening Time:</span>
                  <span className="text-lighttextGray">{partner.restaurant.openingTime || 'Not provided'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-cartNumBg" />
                  <span className="text-textColor font-medium">Closing Time:</span>
                  <span className="text-lighttextGray">{partner.restaurant.closingTime || 'Not provided'}</span>
                </div>
              </div>

              {partner.restaurant.coverImageURL && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-textColor mb-2 flex items-center gap-1">
                    <FileImage size={16} className="text-cartNumBg" />
                    Cover Image
                  </h4>
                  <img 
                    src={partner.restaurant.coverImageURL} 
                    alt={`${partner.restaurant.name} cover`}
                    className="w-full max-h-56 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          )}

          {/* Rider-specific information */}
          {!isRestaurant && (
            <div className="mb-6 bg-primary p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-headingColor mb-3 border-b pb-2 flex items-center gap-2">
                <Bike size={18} className="text-cartNumBg" />
                Delivery Partner Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Car size={18} className="text-cartNumBg" />
                  <span className="text-textColor font-medium">Vehicle Type:</span>
                  <span className="text-lighttextGray">{partner.vehicleType || 'Not provided'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Car size={18} className="text-cartNumBg" />
                  <span className="text-textColor font-medium">Vehicle Number:</span>
                  <span className="text-lighttextGray">{partner.vehicleNo || 'Not provided'}</span>
                </div>
              </div>

              {partner.licenseImageURL && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-textColor mb-2 flex items-center gap-1">
                    <FileImage size={16} className="text-cartNumBg" />
                    License Image
                  </h4>
                  <img 
                    src={partner.licenseImageURL} 
                    alt="Driver's License"
                    className="w-full max-h-56 object-cover rounded-md"
                  />
                </div>
              )}

              {partner.currentLocation && (partner.currentLocation.lat || partner.currentLocation.lng) && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-textColor mb-2 flex items-center gap-1">
                    <MapPin size={16} className="text-cartNumBg" />
                    Current Location
                  </h4>
                  <div className="text-lighttextGray">
                    Latitude: {partner.currentLocation.lat}, Longitude: {partner.currentLocation.lng}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              <p className="flex items-center gap-2">
                <AlertCircle size={18} />
                {error}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleReject}
              disabled={processing}
              className="py-2 px-6 rounded-md bg-red-100 text-red-600 font-medium hover:bg-red-200 flex items-center gap-2 transition-colors duration-200 disabled:opacity-50"
            >
              {processing && actionType === 'reject' ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <XCircle size={18} />
              )}
              Reject
            </button>
            <button
              onClick={handleApprove}
              disabled={processing}
              className="py-2 px-6 rounded-md bg-green-100 text-green-600 font-medium hover:bg-green-200 flex items-center gap-2 transition-colors duration-200 disabled:opacity-50"
            >
              {processing && actionType === 'approve' ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <CheckCircle size={18} />
              )}
              Approve
            </button>
          </div>
        </div>
      </div>
      
      {/* Render rejection reason modal if shown */}
      {showRejectModal && <RejectReasonModal />}
    </div>
  );
};

export default ViewRequestPopup;
