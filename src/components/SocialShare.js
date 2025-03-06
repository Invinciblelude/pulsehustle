import React from 'react';
import { 
  Button, 
  IconButton, 
  HStack, 
  VStack, 
  Text, 
  useToast, 
  useClipboard,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow
} from '@chakra-ui/react';
import { FaXTwitter, FaFacebook, FaLinkedin, FaLink, FaShare } from 'react-icons/fa6';

/**
 * SocialShare Component
 * Provides buttons to share content to various social media platforms
 * 
 * @param {Object} props
 * @param {string} props.url - The URL to share (defaults to current URL)
 * @param {string} props.title - The title of the content being shared
 * @param {string} props.description - A description of the content being shared
 * @param {string} props.hashtags - Comma-separated hashtags for platforms that support them
 * @param {string} props.via - Twitter via username (without @)
 * @param {boolean} props.compact - If true, shows just a share button that opens a popover
 * @param {Function} props.onShareComplete - Callback function called after sharing with the platform name
 */
const SocialShare = ({ 
  url = window.location.href, 
  title = document.title, 
  description = '', 
  hashtags = 'PulseHustle,Freelance,GigEconomy',
  via = 'PulseHustle',
  compact = false,
  onShareComplete = () => {}
}) => {
  const toast = useToast();
  const { onCopy, hasCopied } = useClipboard(url);

  // Prepare share URLs
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=${encodeURIComponent(hashtags.replace(/,/g, ''))}&via=${encodeURIComponent(via)}`;
  
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
  
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`;

  const handleShare = (platform) => {
    let shareUrl;
    
    switch(platform) {
      case 'twitter':
        shareUrl = twitterUrl;
        break;
      case 'facebook':
        shareUrl = facebookUrl;
        break;
      case 'linkedin':
        shareUrl = linkedinUrl;
        break;
      default:
        return;
    }
    
    // Open share dialog in a new window
    window.open(shareUrl, '_blank', 'width=600,height=400');
    
    // Call the callback with the platform name
    onShareComplete(platform);
  };

  const handleCopy = () => {
    onCopy();
    toast({
      title: "Link copied!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    
    // Call the callback for the copy action
    onShareComplete('copy');
  };

  // Try to use the native share API if available
  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: description,
        url
      })
      .then(() => {
        console.log('Shared successfully');
        onShareComplete('native');
      })
      .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support the Share API
      toast({
        title: "Sharing not supported",
        description: "Please use the social media buttons below",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const ShareButtons = () => (
    <HStack spacing={2} align="center" justify="center" wrap="wrap">
      <IconButton
        aria-label="Share on X"
        icon={<FaXTwitter />}
        onClick={() => handleShare('twitter')}
        colorScheme="gray"
        size="md"
      />
      <IconButton
        aria-label="Share on Facebook"
        icon={<FaFacebook />}
        onClick={() => handleShare('facebook')}
        colorScheme="facebook"
        size="md"
      />
      <IconButton
        aria-label="Share on LinkedIn"
        icon={<FaLinkedin />}
        onClick={() => handleShare('linkedin')}
        colorScheme="linkedin"
        size="md"
      />
      <IconButton
        aria-label="Copy link"
        icon={<FaLink />}
        onClick={handleCopy}
        colorScheme={hasCopied ? "green" : "gray"}
        size="md"
      />
    </HStack>
  );

  if (compact) {
    return (
      <Popover placement="bottom" closeOnBlur={true}>
        <PopoverTrigger>
          <IconButton
            aria-label="Share"
            icon={<FaShare />}
            colorScheme="cyan"
            size="md"
            variant="ghost"
          />
        </PopoverTrigger>
        <PopoverContent width="auto">
          <PopoverArrow />
          <PopoverBody>
            <VStack spacing={2}>
              <ShareButtons />
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <VStack spacing={3} align="center">
      <Text fontWeight="bold">Share this</Text>
      
      {/* Try native sharing first on mobile */}
      <Button 
        leftIcon={<FaShare />} 
        onClick={handleNativeShare}
        display={['block', 'block', 'none']} // Only show on mobile
        colorScheme="cyan"
        width="100%"
      >
        Share
      </Button>
      
      <ShareButtons />
    </VStack>
  );
};

export default SocialShare; 