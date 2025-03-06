import React from 'react';
import { 
  Box, 
  Text, 
  VStack, 
  Divider, 
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import SocialShare from './SocialShare';
import { socialShareConfig } from '../config/authConfig';
import { recordSocialShare } from '../api/services/statsService';

/**
 * GigSocialShare Component
 * A specialized social sharing component for gig listings
 * with tracking and analytics
 * 
 * @param {Object} props
 * @param {Object} props.gig - The gig object to share
 * @param {boolean} props.isPreview - Whether it's a preview being shared
 * @param {string} props.layout - The layout style ('inline', 'compact', 'full')
 * @param {Function} props.onShareComplete - Callback after sharing completes
 */
const GigSocialShare = ({ 
  gig, 
  isPreview = false, 
  layout = 'inline',
  onShareComplete = () => {}
}) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Prepare share content
  const shareUrl = isPreview 
    ? window.location.href
    : `${window.location.origin}/gigs/${gig.id}`;
  
  const title = `${socialShareConfig.shareMessages.gig} ${gig.title}`;
  
  // Prepare description with earnings potential
  const description = `${gig.title} - Earn up to $${gig.worker_rate || 570} on PulseHustle, the platform with a 95/5 earnings split!`;
  
  // Prepare hashtags: combine gig skills with default hashtags
  let hashtags = socialShareConfig.defaultHashtags;
  if (gig.skills_required && Array.isArray(gig.skills_required)) {
    const skillHashtags = gig.skills_required
      .map(skill => skill.replace(/\s+/g, ''))
      .join(',');
    hashtags = `${hashtags},${skillHashtags}`;
  }

  // Track the share event
  const trackShare = async (platform) => {
    try {
      if (!isPreview && gig.id) {
        await recordSocialShare({
          gigId: gig.id,
          platform,
          userId: null, // Will be filled by the backend if user is logged in
        });
      }
      
      onShareComplete(platform);
      
      toast({
        title: "Shared successfully!",
        description: "Thanks for spreading the word about this gig.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error tracking share:', error);
      // Continue silently if tracking fails
    }
  };

  // Create a wrapper for the SocialShare component with tracking
  const TrackedSocialShare = () => (
    <SocialShare
      url={shareUrl}
      title={title}
      description={description}
      hashtags={hashtags}
      via={socialShareConfig.defaultVia}
      compact={layout === 'compact'}
      onShareComplete={trackShare}
    />
  );

  // Render different layouts
  if (layout === 'compact') {
    return (
      <Box>
        <TrackedSocialShare />
        
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Share this Gig</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <SocialShare
                url={shareUrl}
                title={title}
                description={description}
                hashtags={hashtags}
                via={socialShareConfig.defaultVia}
                compact={false}
                onShareComplete={trackShare}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    );
  }

  if (layout === 'full') {
    return (
      <VStack spacing={4} p={4} borderWidth="1px" borderRadius="md" width="100%">
        <Text fontSize="lg" fontWeight="bold">
          Share this opportunity
        </Text>
        <Text fontSize="sm">
          Help someone find their next gig! Share this opportunity with your network.
        </Text>
        <Divider />
        <TrackedSocialShare />
      </VStack>
    );
  }

  // Default inline layout
  return <TrackedSocialShare />;
};

export default GigSocialShare; 