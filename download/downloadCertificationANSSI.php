<?php
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="Certificat_Annsi.pdf"');
header("Content-Length: " . filesize("Certificat_Annsi.pdf"));
$fp = fopen("Certificat_Annsi.pdf", "r");
fpassthru($fp);
fclose($fp);
?>

