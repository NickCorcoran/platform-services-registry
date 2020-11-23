//
// Copyright © 2020 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

import React, { useEffect, useState } from 'react';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import { Box, Text } from 'rebass';
import Icon from '../components/Icon';
import ProfileEditableContact from '../components/ProfileEditableContact';
import ProfileEditableProject from '../components/ProfileEditableProject';
import ProfileEditableQuota from '../components/ProfileEditableQuota';
import { ShadowBox } from '../components/UI/shadowContainer';
import { PROFILE_VIEW_NAMES, RESPONSE_STATUS_CODE, ROUTE_PATHS } from '../constants';
import theme from '../theme';
import { promptErrToastWithText } from '../utils/promptToastHelper';
import useRegistryApi from '../utils/useRegistryApi';

interface IProfileEditProps {
    openBackdropCB: () => void;
    closeBackdropCB: () => void;
};

const ProfileEdit: React.FC<IProfileEditProps> = (props) => {
    const api = useRegistryApi();
    // @ts-ignore
    const { match: { params: { profileId, viewName } }, openBackdropCB, closeBackdropCB } = props;

    const [initialRender, setInitialRender] = useState(true);
    const [unauthorizedToAccess, setUnauthorizedToAccess] = useState(false);
    const [profileJson, setProfileJson] = useState({});

    useEffect(() => {
        async function wrap() {
            openBackdropCB();
            try {
                const response = await api.getProfileByProfileId(profileId);
                setProfileJson(response.data);
                // TODO: remove console log and start passing profilejson to each profile view
                console.log(profileJson);
            } catch (err) {
                if (err.response && err.response.status && err.response.status === RESPONSE_STATUS_CODE.UNAUTHORIZED) {
                    setUnauthorizedToAccess(true);
                } else {
                    // when api returns 500 or queried profile entry does not exist
                    promptErrToastWithText('Something went wrong');
                }
            }
            setInitialRender(false);
            closeBackdropCB();
        }
        wrap();
        // eslint-disable-next-line
    }, []);

    if (initialRender) {
        return null;
    }

    if (unauthorizedToAccess) {
        return <Redirect to={ROUTE_PATHS.NOT_FOUND} />;
    }

    // here we divide profile-related views based on query param
    if (viewName === PROFILE_VIEW_NAMES.OVERVIEW) {
        return (<div>profile overview</div>);
    } else {
        return (
            <>
                <Box p={3} mt={4} bg={theme.colors.bcblue}>
                    {/* TODO: fix route url using constant */}
                    <RouterLink className='misc-class-m-dropdown-link' to={`/profile/${profileId}/overview`}>
                        <Icon hover color={'contrast'} name={'goBack'} width={1} height={1} />
                    </RouterLink>
                    <Text as="h3" color={theme.colors.contrast}>
                        {(viewName)}
                    </Text>
                </Box>
                <ShadowBox p={3}>
                    {(viewName === PROFILE_VIEW_NAMES.PROJECT) && <ProfileEditableProject />}
                    {(viewName === PROFILE_VIEW_NAMES.CONTACT) && <ProfileEditableContact />}
                    {(viewName === PROFILE_VIEW_NAMES.QUOTA) && <ProfileEditableQuota />}
                    ------------
                    <br />
                    cancel button
                    submit button
                </ShadowBox>
            </>
        );
    }
};

export default ProfileEdit;