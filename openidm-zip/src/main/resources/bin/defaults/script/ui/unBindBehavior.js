/*
 * The contents of this file are subject to the terms of the Common Development and
 * Distribution License (the License). You may not use this file except in compliance with the
 * License.
 *
 * You can obtain a copy of the License at legal/CDDLv1.0.txt. See the License for the
 * specific language governing permission and limitations under the License.
 *
 * When distributing Covered Software, include this CDDL Header Notice in each file and include
 * the License file at legal/CDDLv1.0.txt. If applicable, add the following below the CDDL
 * Header, with the fields enclosed by brackets [] replaced by your own identifying
 * information: "Portions copyright [year] [name of copyright owner]".
 *
 * Copyright 2016 ForgeRock AS.
 */

if (object.idpData !== null &&
    object.idpData !== undefined &&
    object.idpData[request.additionalParameters.provider] !== null &&
    object.idpData[request.additionalParameters.provider].enabled === true) {

    var _ = require('lib/lodash'),
        user = openidm.read(resourcePath),
        enabledCount = 0,
        disableProvider = function() {
            // disable social provider via use of "enabled": false -
            object.idpData[request.additionalParameters.provider].enabled = false;

            // uncomment below line to delete social provider data -
            // delete object.idpData[request.additionalParameters.provider];

            // update the object in every case:
            openidm.update(resourcePath, object._rev, object);
        };

    if (!user.password) {
        // make sure user isn't turning off last IDP with no password set
        enabledCount = _.filter(_.values(object.idpData), function(idp) {
            return idp.enabled;
        }).length;

        if (enabledCount > 1) {
            disableProvider();
        } else {
            throw {
                "code" : 400,
                "message" : "config.messages.socialProviders.cannotUnbind"
            };
        }
    } else {
        disableProvider();
    }
}
