package io.github.abforce.cordovaguard;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import org.apache.cordova.ConfigXmlParser;
import org.xmlpull.v1.XmlPullParser;
import android.content.Context;
import android.util.Log;
import java.util.ArrayList;
import java.util.List;

/**
 * This class echoes a string called from JavaScript.
 */
public class CordovaGuard extends CordovaPlugin {

    private static final String LOG_TAG = "CordovaGuard";

    private List<Permission> permissions;

    // Used when instantiated via reflection by PluginManager
    public CordovaGuard() {
    }

    // These can be used by embedders to allow Java-configuration of whitelists.
    public CordovaGuard(Context context) {
        this(new ArrayList<Permission>());
        new CustomConfigXmlParser().parse(context);
    }

    public CordovaGuard(XmlPullParser xmlParser) {
        this(new ArrayList<Permission>());
        new CustomConfigXmlParser().parse(xmlParser);
    }

    public CordovaGuard(List<Permission> permissions) {
        if (permissions == null) {
            permissions = new ArrayList<Permission>();
        }
        this.permissions = permissions;
    }

    @Override
    public void pluginInitialize() {
        if (permissions == null) {
            permissions = new ArrayList<Permission>();
            new CustomConfigXmlParser().parse(webView.getContext());
        }
    }

    /**
     * Executes the request and returns PluginResult.
     *
     * @param action            The action to execute.
     * @param args              JSONArray of arguments for the plugin.
     * @param callbackContext   The callback id used when calling back into JavaScript.
     * @return                  True if the action was valid, false if not.
     */
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("getPermissions")) {
            JSONArray array = new JSONArray();
            for(Permission p : permissions){
                JSONObject r = new JSONObject();
                r.put("source", p.source);
                r.put("pluginName", p.pluginName);
                r.put("access", p.access);

                //TODO: put 'r' into the array COMPLETED
                array.put(r);
            }
            //TODO: return 'array'
            callbackContext.success(array);
        }
        else {
            return false;
        }
        return true;
    }

    private class CustomConfigXmlParser extends ConfigXmlParser {
        @Override
        public void handleStartTag(XmlPullParser xml) {
            String strNode = xml.getName();

            if (strNode.equals("permission")){
                String source = xml.getAttributeValue(null, "source");
                String pluginName = xml.getAttributeValue(null, "plugin-name");
                String access = xml.getAttributeValue(null, "access");
                permissions.add(new Permission(source, pluginName, access.equals("true")));
            }
        }
        @Override
        public void handleEndTag(XmlPullParser xml) {
        }
    }

    private static class Permission{
        private String source;
        private String pluginName;
        private boolean access;

        private Permission(String source, String pluginName, boolean access){
            this.source = source;
            this.pluginName = pluginName;
            this.access = access;
        }
    }
    
}
