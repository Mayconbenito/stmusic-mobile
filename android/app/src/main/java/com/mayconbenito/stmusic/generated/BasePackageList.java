package com.mayconbenito.stmusic.generated;

import java.util.Arrays;
import java.util.List;
import org.unimodules.core.interfaces.Package;

public class BasePackageList {
  public List<Package> getPackageList() {
    return Arrays.<Package>asList(
        new expo.modules.permissions.PermissionsPackage(),
        new expo.modules.updates.UpdatesPackage()
    );
  }
}
