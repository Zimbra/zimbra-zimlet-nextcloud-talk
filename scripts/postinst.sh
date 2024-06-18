#!/bin/bash
echo "*** Configuring Zimbra-Zimlet-Nextcloud-Talk ***"
su - zimbra -c "zmmailboxdctl status"
if [ $? -ne 0 ]; then
   echo "*** Mailbox is not running... ***"
   echo "*** Follow the steps below as zimbra user ignore if installing through install.sh .. ***"
   echo "*** Install the Zimbra-Zimlet-Nextcloud-Talk Zimlet ***"
   echo "*** zmzimletctl -l deploy /opt/zimbra/zimlets-network/zimbra-zimlet-nextcloud-talk.zip ***"
   echo "*** zmprov fc zimlet ***"
else
   echo "*** Deploying Zimbra-Zimlet-Nextcloud-Talk Zimlett ***"
   su - zimbra -c  "zmzimletctl -l deploy /opt/zimbra/zimlets-network/zimbra-zimlet-nextcloud-talk.zip"
   su - zimbra -c  "zmprov fc zimlet"
fi
echo "*** Zimbra-Zimlet-Nextcloud-Talk Installation Completed. ***"
echo "*** Restart the mailbox service as zimbra user. Run ***"
echo "*** su - zimbra ***"
echo "*** zmmailboxdctl restart ***"
