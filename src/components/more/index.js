import { createElement, Component, render } from 'preact';
import { compose } from 'recompose';
import { withIntl } from '../../enhancers';
import { useState, useCallback, useMemo, useContext } from 'preact/hooks';
import { Text, IntlProvider, Localizer, IntlContext } from 'preact-i18n';
import style from './style';
import { Button } from '@zimbra-client/blocks';
import { OAuthClient } from '@zimbra/oauth-client';

function createMore(props, context) {
   const childIcon = (
      <span class={style.appIcon}>
      </span>);

   const { intl } = useContext(IntlContext)
   const zimletStrings = intl.dictionary['zimbra-zimlet-nextcloud-talk'];

   const handleClick = (e) => {
      // https://nextcloud-talk.readthedocs.io/en/latest/conversation/#creating-a-new-conversation):
      const oauthClient = new OAuthClient(context);
      oauthClient.getInfo('nextcloud')
         .then(info => {
            const NextcloudApiURL = info.nextcloud_url.replace('index.php', 'ocs/v2.php/apps/spreed/api/v4/room');
            const NextcloudCallURL = info.nextcloud_url.replace('index.php', 'index.php/call/');
            let title = props.event.name ? props.event.name : zimletStrings.meetingTitle;

            let fakeEmailData = {}
            fakeEmailData.nextcloudAction = "createTalkConv";
            fakeEmailData.body = { "roomType": 3, "roomName": title };
            fakeEmailData.NextcloudApiURL = NextcloudApiURL;
            fakeEmailData.nextcloudPath = "/";
            fakeEmailData.nextcloudDAVPath = "";
            var request = new XMLHttpRequest();
            var url = '/service/extension/nextcloud';
            var formData = new FormData();
            formData.append("jsondata", JSON.stringify(fakeEmailData));
            request.open('POST', url);
            request.onreadystatechange = function (e) {
               if (request.readyState == 4) {
                  if (request.status == 200) {
                     const OCSResponse = JSON.parse(request.responseText);

                     //handleLocationChange is a method passed (via props) to the Zimlet slot that allows you to set the location of the appointment
                     props.handleLocationChange({ value: [NextcloudCallURL + OCSResponse.ocs.data.token] });
                  }
                  if (request.status == 400) {
                     const OCSResponse = JSON.parse(request.responseText);
                  }
               }
            }
            request.send(formData);


         });
   }

   return (
      <Button
         class={style.button}
         onClick={handleClick}
         brand="primary"
         icon={childIcon}
      >
         <Text id={`zimbra-zimlet-nextcloud-talk.title`} />
      </Button>
   );
}

//By using compose from recompose we can apply internationalization to our Zimlet
//https://blog.logrocket.com/using-recompose-to-write-clean-higher-order-components-3019a6daf44c/
export default compose(
   withIntl()
)
   (
      createMore
   )
